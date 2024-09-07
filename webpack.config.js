const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'] // 공통 확장자 처리
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // 공통 출력 경로
    clean: true // dist 폴더 청소
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        use: 'ts-loader' // 공통 TypeScript 처리
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'] // 개발 환경에서는 style-loader 사용
      },
      {
        test: /\.(png|jpg|jpeg|gif|mp4|webm)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]' // 공통 이미지 처리
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv()
  ]
};
