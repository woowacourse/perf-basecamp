const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'nosources-source-map',
  plugins: [new MiniCssExtractPlugin(), new CssMinimizerPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        deleteOriginalAssets: false, // 원본 이미지 파일 삭제 방지
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [['webp', { quality: 35 }]]
          }
        }
      }),
      new TerserWebpackPlugin({
        terserOptions: {
          format: {
            comments: false
          },
          compress: {
            drop_console: true
          }
        },
        extractComments: false
      })
    ],
    splitChunks: {
      chunks: 'all'
    }
  }
});
