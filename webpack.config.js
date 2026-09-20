const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// LCP 이미지는 스크립트가 실행되기 전에는 HTML에서 발견되지 않으므로 head에 preload 태그를 넣는다.
// type을 지원하지 않는 브라우저는 이 태그를 무시하고 <picture>의 폴백을 평소대로 받는다
class PreloadImagePlugin {
  constructor(test, type) {
    this.test = test;
    this.type = type;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('PreloadImagePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap('PreloadImagePlugin', (data) => {
        const image = Object.keys(compilation.assets).find((name) => this.test.test(name));
        if (image) {
          data.assetTags.styles.unshift(
            HtmlWebpackPlugin.createHtmlTagObject('link', {
              rel: 'preload',
              as: 'image',
              type: this.type,
              href: image,
              fetchpriority: 'high'
            })
          );
        }
        return data;
      });
    });
  }
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      chunkFilename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      assetModuleFilename: isProduction ? 'static/[name].[contenthash:8][ext]' : 'static/[name][ext]',
      path: path.join(__dirname, '/dist'),
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new PreloadImagePlugin(/hero\..*avif$/, 'image/avif'),
      new CopyWebpackPlugin({
        patterns: [{ from: './public', to: './public' }]
      }),
      new Dotenv(),
      new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash:8].css' })
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader'
          }
        },
        {
          test: /\.css$/i,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|avif|mp4)$/i,
          type: 'asset/resource'
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      minimizer: ['...', new CssMinimizerPlugin()],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial'
          }
        }
      }
    }
  };
};
