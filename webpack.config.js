const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { buildSearchMarkup } = require('./scripts/prerender-search.cjs');

module.exports = async (env = {}, argv = {}) => {
  const isProduction = argv.mode === 'production';
  // The dedicated CloudFront distribution serves the S3 prefix at the domain root.
  const publicPath = env.publicPath ?? process.env.PUBLIC_PATH ?? '/';
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(publicPath)) {
    throw new Error('PUBLIC_PATH must be / or a path such as /lumen/ with a trailing slash.');
  }
  const searchMarkup = isProduction
    ? await buildSearchMarkup({ publicPath, context: __dirname })
    : '';

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: 'static/[name].[contenthash:8].js',
      chunkFilename: 'static/[name].[contenthash:8].js',
      assetModuleFilename: 'static/[name].[contenthash:8][ext]',
      path: path.join(__dirname, 'dist'),
      publicPath,
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      compress: true,
      historyApiFallback: true
    },
    devtool: isProduction ? false : 'eval-cheap-module-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        // Search already receives its styles inline; avoid a blocking duplicate request.
        inject: !isProduction,
        // React's Suspense hydration markers are HTML comments.
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeComments: false,
              minifyCSS: true,
              minifyJS: true,
              ignoreCustomFragments: [/<template id="search-prerender">[\s\S]*?<\/template>/]
            }
          : false,
        templateParameters: (compilation, assets, tags, options) => {
          const initialAssets = new Set([...assets.js, ...assets.css]);
          const searchFiles = [
            ...new Set(
              ['search', 'giphy-api'].flatMap(
                (name) => compilation.namedChunkGroups.get(name)?.getFiles() ?? []
              )
            )
          ].filter((file) => /\.(js|css)$/.test(file));
          const searchAssets = searchFiles
            .map((file) => `${publicPath}${file}`)
            .filter((file) => !initialAssets.has(file));

          const cssFiles = new Set([
            ...assets.css.map((file) => file.slice(publicPath.length)),
            ...searchFiles.filter((file) => file.endsWith('.css'))
          ]);
          let searchCriticalCss = searchMarkup
            ? [...cssFiles]
                .map((file) => compilation.getAsset(file)?.source.source().toString() ?? '')
                .join('\n')
            : '';
          for (const font of compilation.getAssets()) {
            // The large heading needs the italic face for its first paint. Other
            // text can use font-display: swap while the small normal face loads.
            if (/\/search-ui-italic\.[^.]+\.woff2$/.test(font.name)) {
              searchCriticalCss = searchCriticalCss.replaceAll(
                `${publicPath}${font.name}`,
                `data:font/woff2;base64,${font.source.buffer().toString('base64')}`
              );
            }
          }

          return {
            compilation,
            webpackConfig: compilation.options,
            htmlWebpackPlugin: { tags, files: assets, options },
            publicPath,
            searchAssets,
            searchStyleAssets: [...cssFiles].map((file) => `${publicPath}${file}`),
            searchMarkup,
            searchCriticalCss
          };
        }
      }),
      new DefinePlugin({ 'process.env.PUBLIC_PATH': JSON.stringify(publicPath) }),
      new CopyWebpackPlugin({ patterns: [{ from: './public', to: './public' }] }),
      new Dotenv(),
      ...(isProduction
        ? [new MiniCssExtractPlugin({ filename: 'static/[name].[contenthash:8].css' })]
        : []),
      ...(env.analyze
        ? [new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })]
        : [])
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            // TypeScript must retain webpack's dynamic-import chunk-name comment.
            options: { compilerOptions: { removeComments: false } }
          }
        },
        {
          test: /\.css$/i,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff2?|png|jpe?g|gif|webp|mp4)$/i,
          type: 'asset/resource'
        }
      ]
    },
    optimization: {
      // Let HtmlWebpackPlugin preserve React's hydration markup when minifying HTML.
      minimize: isProduction ? { html: false } : false,
      // Keep webpack's Terser minimizer, including unused icon removal.
      minimizer: ['...', new CssMinimizerPlugin()],
      splitChunks: { chunks: 'all' },
      runtimeChunk: 'single'
    }
  };
};
