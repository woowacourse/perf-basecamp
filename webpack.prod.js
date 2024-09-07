const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    // new CompressionPlugin(),
    new BundleAnalyzerPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist/public')
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'image-webpack-loader',
        enforce: 'pre'
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin()
      // new ImageMinimizerPlugin({
      //   test: /\.(png|jpg|jpeg)$/i,
      //   generator: [
      //     {
      //       preset: 'avif',
      //       type: 'asset',
      //       implementation: ImageMinimizerPlugin.sharpGenerate,
      //       options: {
      //         encodeOptions: {
      //           avif: {
      //             quality: 50
      //           }
      //         }
      //       }
      //     }
      //   ]
      // })
    ]
  }
});
