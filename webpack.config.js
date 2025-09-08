const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: isProduction ? '[name].[contenthash].js' : '[name].bundle.js',
      chunkFilename: isProduction ? '[name].[contenthash].js' : '[name].chunk.js',
      path: path.join(__dirname, '/dist'),
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
      compress: true
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
        { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|mp4)$/i,
          type: 'asset/resource',
          generator: {
            filename: isProduction ? 'static/[name].[contenthash:8][ext]' : 'static/[name][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024
            }
          }
        },
        {
          test: /hero\.(webp|png|jpg|jpeg)$/i,
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
            format: {
              comments: false
            }
          }
        })
      ],
      usedExports: true,
      sideEffects: false,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 3,
        maxAsyncRequests: 5,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
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
            chunks: 'all',
            enforce: true
          },
          reactIcons: {
            test: /[\\/]node_modules[\\/]react-icons[\\/]/,
            name: 'react-icons',
            chunks: 'all',
            priority: 20
          }
        }
      },
      runtimeChunk: 'single'
    }
  };
};
