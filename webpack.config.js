const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

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
      new Dotenv()
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
        '...',
        new ImageMinimizerPlugin({
          generator: [
            {
              preset: 'webp',
              implementation: ImageMinimizerPlugin.imageminGenerate,
              options: {
                plugins: [['imagemin-webp', { quality: 75 }]]
              }
            }
          ]
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
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all'
          },
          reactIcons: {
            test: /[\\/]node_modules[\\/]react-icons[\\/]/,
            name: 'react-icons',
            chunks: 'all',
            priority: 20
          },
          images: {
            test: /\.(png|jpe?g|gif|svg|webp|mp4)$/i,
            name: 'images',
            chunks: 'all',
            priority: 5
          }
        }
      },
      runtimeChunk: 'single'
    }
  };
};
