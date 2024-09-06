const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

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
  devtool: mode === 'production' ? false : 'source-map',
  plugins: [
    new MiniCssExtractPlugin({
      /* 나중에 캐시쓸 떄 해쉬값 사용 */
      filename: '[name].[contenthash].css'
    }),
    new CssMinimizerPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new CompressionPlugin({
      algorithm: 'gzip',
      exclude: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|txt|map|ico|mp4)$/i
    })
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
        use: [mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|mp4)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [`...`, new CssMinimizerPlugin()]
  }
};
