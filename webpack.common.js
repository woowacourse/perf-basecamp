const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  resolve: { extensions: ['.js', '.jsx'] },
  output: {
    filename: 'bundle.[chunkhash].js',
    path: path.join(__dirname, '/dist'),
    clean: true,
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }],
    }),
    new Dotenv(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|webm)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
