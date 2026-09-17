const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    path: path.join(__dirname, '/dist'),
    clean: true,
    publicPath: '/'
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
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].chunk.css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // 빌드 후 결과 리포트를 생성
      openAnalyzer: false, // 빌드 시 브라우저가 자동으로 열리는 것을 방지
      reportFilename: 'bundle-report.html' // 생성될 리포트 파일 이름
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.gif$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[contenthash][ext]'
        }
      },
      {
        test: /\.(png|jpg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[contenthash][ext]'
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              // PNG 압축 옵션
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              }
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: ['...', new CssMinimizerPlugin()]
  }
};
