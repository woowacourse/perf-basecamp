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
          implementation: ImageMinimizerPlugin.sharpMinify
        },
        generator: [
          {
            preset: 'hero-webp',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              resize: {
                enabled: true,
                width: 1920
              },
              encodeOptions: {
                webp: {
                  quality: 40
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
                  quality: 30
                }
              }
            }
          }
        ]
      })
    ]
  }
});
