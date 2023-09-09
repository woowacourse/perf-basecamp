const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: '[name].[chunkhash].bundle.js',
    path: path.join(__dirname, '/dist'),
    clean: true,
    assetModuleFilename: './static/[name].[contenthash].[ext]'
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-report.json'
    })
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      `...`,
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          },
          format: {
            comments: false
          },
          extractComments: false
        }
      }),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: 'png-webp',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              resize: {
                width: 1920
              },
              encodeOptions: {
                webp: {
                  quality: 35
                }
              }
            }
          },
          {
            preset: 'gif-webp',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 50
                }
              }
            }
          }
        ]
      })
    ],
    splitChunks: {
      cacheGroups: {
        giphy: {
          test: /[\\/]node_modules[\\/](@giphy)[\\/]/,
          name: 'giphy',
          enforce: true,
          chunks: 'all'
        },
        reactIcons: {
          test: /[\\/]node_modules[\\/](react-icons)[\\/]/,
          name: 'react-icons',
          chunks: 'all'
        }
      }
    }
  }
};
