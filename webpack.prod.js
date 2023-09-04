const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(jpe?g|png)$/i,
        use: [
          {
            loader: 'responsive-loader',
            options: {
              adapter: require('responsive-loader/sharp'),
              sizes: [480, 800, 1200, 2400],
              placeholder: true,
              placeholderSize: 20,
              name: 'static/[name]-[width].[ext]',
              format: 'webp'
            }
          }
        ]
      },
      {
        test: /\.(gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/[name].webp'
            }
          },
          {
            loader: path.resolve(__dirname, './buffer-loader.js')
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  optimization: {
    minimizer: ['...']
  }
});
