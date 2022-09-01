const path = require('path');
const common = require('./webpack.config');
const { merge } = require('webpack-merge');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const { sources } = require('webpack');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: 'bundle.[name].[contenthash:8].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  module: {
    rules: [
      // You need this, if you are using `import file from "file.ext"`, for `new URL(...)` syntax you don't need it
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset'
      }
    ]
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          filter: (sources, pathname) => {},
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            resize: {
              enabled: true,
              width: 1000
            }
          }
        }
      })
    ],
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png|gif)$/i,
          options: {
            quality: 90
          }
        }
      ],
      overrideExtension: true,
      detailedLogs: false,
      silent: false,
      strict: true
    })
  ]
});
