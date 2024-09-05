const path = require('path');
const webpack = require('webpack');

const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const isDevMode = process.env.NODE_ENV === 'development';

const commonPlugins = [
  new HtmlWebpackPlugin({
    template: './index.html'
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './public',
        to: './public',
        globOptions: {
          ignore: ['**/404.html'] // 404.html 파일 제외
        }
      },
      {
        from: path.resolve(__dirname, './public/404.html'),
        to: path.resolve(__dirname, 'dist')
      }
    ]
  }),
  new webpack.EnvironmentPlugin({
    NODE_ENV: process.env.NODE_ENV || 'development'
  }),
  new Dotenv(),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'bundle-report.html',
    openAnalyzer: true,
    excludeAssets: [/node_modules/]
  })
];

const devPlugins = [
  // new BundleAnalyzerPlugin({
  //   analyzerMode: 'static',
  //   reportFilename: 'bundle-report.html',
  //   openAnalyzer: true,
  //   excludeAssets: [/node_modules/]
  // })
];

const prodPlugins = [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
    chunkFilename: '[id].[contenthash].css' // 코드 스플리팅 시 생성되는 추가적인 청크 파일의 이름
  }),
  new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.(js|css|html|svg)$/,
    threshold: 10240,
    minRatio: 0.8
  })
];

// 최종 플러그인 설정
const plugins = [...commonPlugins, ...(isDevMode ? devPlugins : prodPlugins)];

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  output: {
    filename: isDevMode ? 'bundle.js' : 'bundle.[contenthash].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  cache: false,
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  devtool: 'source-map',
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      }
    ]
  },
  plugins,
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()]
  }
};
