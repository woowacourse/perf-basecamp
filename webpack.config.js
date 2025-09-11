const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: 'bundle.[contenthash].js',
    chunkFilename: '[name].[contenthash].bundle.js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
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
          loader: 'esbuild-loader'
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|webp|woff|woff2|png|jpe?g|gif|mp4)$/i,
        type: 'asset'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        deleteOriginalAssets: false,
        // webp 변환기 추가
        generator: [
          {
            preset: 'webp-png',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 40,
                  resize: { width: 1280 }
                }
              }
            },
            filter: (_, sourcePath) => sourcePath.endsWith('.png')
          },
          {
            preset: 'avif-png',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                avif: {
                  quality: 30,
                  resize: { width: 1280 }
                }
              }
            },
            filter: (_, sourcePath) => sourcePath.endsWith('.png')
          },
          {
            preset: 'webp-gif',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                webp: {
                  quality: 40
                }
              }
            },
            filter: (_, sourcePath) => sourcePath.endsWith('.gif')
          }
        ]
      })
    ]
  }
};
