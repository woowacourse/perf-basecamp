const path = require('path');
const common = require('./webpack.config');
const { merge } = require('webpack-merge');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

https: module.exports = merge(common, {
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devtool: 'nosources-source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify
        }
      }),
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin()
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png|gif)$/i,
          options: {
            quality: 90
          }
        }
      ],
      overrideExtension: false,
      detailedLogs: false,
      silent: false,
      strict: true
    })
  ]
});
