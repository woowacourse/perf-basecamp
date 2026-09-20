const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: 'static/[name].[contenthash:8].js',
    chunkFilename: 'static/[name].[contenthash:8].js',
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
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: 'static/[name].[contenthash:8].css',
      chunkFilename: 'static/[name].[contenthash:8].css'
    }),
    ...(process.env.ANALYZE === 'true'
      ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../report/bundle-report.html',
            openAnalyzer: false,
            generateStatsFile: true,
            statsFilename: '../report/stats.json'
          })
        ]
      : [])
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|avif|mp4)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[contenthash:8].[ext]'
        }
      }
    ]
  },
  optimization: {
    runtimeChunk: 'single',
    minimize: true,
    usedExports: true,
    minimizer: ['...', new CssMinimizerPlugin()]
  }
};
