const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const mode = process.env.NODE_ENV || 'development';

const isProd = mode === 'production';

module.exports = {
  mode,
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
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      // style-loader, css-loader 구성
      {
        test: /\.css$/i,
        exclude: /\.module\.css$/i, // 모듈 파일 제외 설정
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
      },
      // CSS Module ([filename].module.css)
      {
        test: /\.module\.css$/i,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
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
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true, // 빈칸 제거,
        removeComments: true // 주석 제거
      },
      template: './index.html',
      hash: true // 결과물 index.html이 매 빌드마다 다른 queryString과 함께 bundle.js를 불러들이도록 함으로써 파일이 동일하지 않다는 것을 알림 - 캐싱 방지
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ],
  optimization: {
    minimize: true,
    minimizer: isProd ? [new CssMinimizerPlugin(), new TerserPlugin()] : []
  }
};
