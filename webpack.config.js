const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: isProduction ? 'main.[contenthash].js' : 'bundle.js',
      path: path.join(__dirname, '/dist'),
      clean: true,
      chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].js'
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'head',
        scriptLoading: 'defer',
        minify: isProduction
          ? {
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true
            }
          : false
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './public', to: './public' }]
      }),
      new Dotenv(),
      new BundleAnalyzerPlugin()
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
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|avif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name][ext]'
          }
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      minimizer: [new CssMinimizerPlugin()],
      splitChunks: isProduction
        ? {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                chunks: 'all',
                filename: 'vendor.[contenthash].js'
              },
              search: {
                test: /[\\/]src[\\/]pages[\\/]Search[\\/]/,
                name: 'search',
                chunks: 'all',
                filename: 'search.[contenthash].js'
              }
            }
          }
        : false,
      usedExports: isProduction,
      sideEffects: ['*.css']
    }
  };
};
