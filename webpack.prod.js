const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [['gifsicle', { interlaced: true, optimizationLevel: 3, colors: 64 }]]
          }
        }
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [['webp', { quality: 50, resize: { width: 1920, height: 0 } }]]
          }
        }
      })
    ]
  }
});
