const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDevMode = process.env.NODE_ENV === 'development';

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
  devtool: isDevMode ? 'source-map' : false,
  plugins: [
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true, // 빈칸 제거
        removeComments: true // 주석 제거
      },
      template: './index.html',
      hash: true
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: ({ chunk }) => `${chunk.name.replace('/js/', '/css/')}.css`,
      chunkFilename: '[id].[contenthash].css'
    }),
    new BundleAnalyzerPlugin()
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
        use: [isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|webm|mp4)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true
  }
};
