const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

// Keep the renderer outside dist: only its generated HTML is deployed. Package
// imports resolve against the project because this bundle lives in a temp dir.
async function buildSearchMarkup({ publicPath, context }) {
  const outputPath = await fs.mkdtemp(path.join(os.tmpdir(), 'memegle-prerender-'));
  const rendererPath = path.join(outputPath, 'search.cjs');
  let compiler;

  try {
    compiler = webpack({
      mode: 'production',
      context,
      target: 'node',
      entry: path.join(context, 'src/prerender.tsx'),
      resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
      output: {
        path: outputPath,
        filename: 'search.cjs',
        library: { type: 'commonjs2' },
        publicPath,
        assetModuleFilename: 'static/[name].[contenthash:8][ext]'
      },
      devtool: false,
      optimization: { minimize: false },
      externals: [
        ({ context: moduleContext, request }, callback) => {
          if (!request || !/^(?:[A-Za-z@])/.test(request)) {
            callback();
            return;
          }

          try {
            const resolved = require.resolve(request, {
              paths: [moduleContext ?? context, context]
            });
            callback(null, `commonjs ${resolved}`);
          } catch (error) {
            callback(error);
          }
        }
      ],
      plugins: [
        new webpack.DefinePlugin({ 'process.env.PUBLIC_PATH': JSON.stringify(publicPath) }),
        new Dotenv({ path: path.join(context, '.env') })
      ],
      module: {
        rules: [
          {
            test: /\.(js|jsx|ts|tsx)$/i,
            exclude: /node_modules/,
            use: {
              loader: require.resolve('ts-loader'),
              options: { transpileOnly: true, configFile: path.join(context, 'tsconfig.json') }
            }
          },
          {
            test: /\.css$/i,
            use: {
              loader: require.resolve('css-loader'),
              // Same CSS Modules context/hash defaults as the browser build.
              // Export class names without injecting styles or needing a DOM.
              options: { modules: { auto: true, exportOnlyLocals: true } }
            }
          },
          {
            test: /\.(eot|svg|ttf|woff2?|png|jpe?g|gif|webp|mp4)$/i,
            type: 'asset/resource',
            generator: { emit: false }
          }
        ]
      }
    });

    const stats = await new Promise((resolve, reject) => {
      compiler.run((error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    if (!stats || stats.hasErrors()) {
      throw new Error(
        `Search prerender compilation failed:\n${
          stats?.toString({ all: false, errors: true }) ?? 'No compilation result'
        }`
      );
    }

    return require(rendererPath).renderSearch(publicPath);
  } finally {
    if (compiler) {
      await new Promise((resolve, reject) => {
        compiler.close((error) => (error ? reject(error) : resolve()));
      }).finally(async () => {
        delete require.cache[rendererPath];
        await fs.rm(outputPath, { recursive: true, force: true });
      });
    } else {
      await fs.rm(outputPath, { recursive: true, force: true });
    }
  }
}

module.exports = { buildSearchMarkup };
