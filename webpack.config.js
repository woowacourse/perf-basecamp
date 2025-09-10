const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist'),
    clean: true
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      openAnalyzer: true
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
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|ttf|woff|woff2|gif|png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: 'webp',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 65
                }
              },
              resize: { enabled: true, width: 1200 }
            }
          },
          {
            preset: 'avif',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                avif: {
                  quality: 65
                }
              },
              resize: { enabled: true, width: 1200 }
            }
          }
        ]
      })
    ]
  }
};
