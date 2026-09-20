const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const ConvertImagesWebpackPlugin = require('./scripts/convert-images-webpack-plugin');
const PreloadHeroImageWebpackPlugin = require('./scripts/preload-hero-image-webpack-plugin');
const PreloadFontsWebpackPlugin = require('./scripts/preload-fonts-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
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
      template: './index.html',
      favicon: './src/assets/images/favicon.ico'
    }),
    new ConvertImagesWebpackPlugin(),
    new PreloadHeroImageWebpackPlugin(),
    new PreloadFontsWebpackPlugin(),
    new Dotenv(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled'
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g|gif|webp|avif|mp4)$/i,
        type: 'javascript/auto',
        loader: 'file-loader',
        options: {
          name: 'static/[name].[contenthash:8].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true
  }
};
