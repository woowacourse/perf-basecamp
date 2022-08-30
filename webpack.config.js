const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    new Dotenv()
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true, optimizationLevel: 3, colors: 32 }],
              ['pngquant', { speed: 3, strip: true, quality: [0.1, 0.1], dithering: 0.1 }]
            ]
          }
        }
      })
    ]
  }
};
