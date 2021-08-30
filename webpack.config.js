const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.js',
  resolve: { extensions: ['.js', '.jsx'] },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist'),
    clean: true,
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      minify: {
        collapseWhiteSpace: true,
        removeComments: true,
      },
      hash: true,
      template: './index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }],
    }),
    new MiniCssExtractPlugin({
      filename: `[name].css`,
    }),
    new Dotenv(),
    new BundleAnalyzerPlugin(),
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
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]',
        },
      },
    ],
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin(), '...'],
  },
};
