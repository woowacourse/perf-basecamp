const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      mainFields: ['module', 'browser', 'main']
    },
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].chunk.js',
      path: path.join(__dirname, 'dist'),
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
      compress: true,
      port: 3000
    },
    devtool: isProduction ? 'hidden-source-map' : 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        scriptLoading: 'defer',
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              minifyJS: true,
              minifyCSS: true
            }
          : false
      }),
      new CopyWebpackPlugin({ patterns: [{ from: './public', to: './public' }] }),
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[name].[contenthash].css' : '[name].css'
      }),
      ...(isProduction
        ? [
            new CompressionPlugin({
              algorithm: 'gzip',
              test: /\.(js|css|html|svg)$/,
              threshold: 8192,
              minRatio: 0.8
            })
          ]
        : [])
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/i,
          exclude: /node_modules/,
          use: { loader: 'ts-loader' }
        },
        {
          test: /\.css$/i,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          type: 'asset',
          generator: {
            filename: isProduction ? 'static/[name].[contenthash:8][ext]' : 'static/[name][ext]'
          },
          parser: {
            dataUrlCondition: { maxSize: 8 * 1024 }
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2|mp4)$/i,
          type: 'asset/resource',
          generator: {
            filename: isProduction ? 'static/[name].[contenthash:8][ext]' : 'static/[name][ext]'
          }
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: true,
              pure_funcs: ['console.log']
            },
            mangle: true,
            format: { comments: false }
          }
        }),
        new CssMinimizerPlugin()
      ],
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 10,
            chunks: 'all'
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all'
          }
        }
      },
      runtimeChunk: 'single'
    }
  };
};
