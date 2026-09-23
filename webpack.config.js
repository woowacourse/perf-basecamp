const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      // 청크가 여러 개이므로 파일명이 겹치지 않도록 청크 이름을 포함한다.
      // 프로덕션에서는 contenthash를 붙여, 내용이 바뀐 파일만 캐시가 무효화되게 한다.
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].bundle.js',
      chunkFilename: isProduction ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
      path: path.join(__dirname, '/dist'),
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true
    },
    // 프로덕션에서는 소스맵을 내보내지 않는다. 배포 산출물의 크기를 키우고,
    // 원본 소스가 그대로 노출되기 때문이다.
    devtool: isProduction ? false : 'source-map',
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
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|mp4)$/i,
          loader: 'file-loader',
          options: {
            // CDN에 긴 캐시를 걸 수 있도록 프로덕션 산출물에는 해시를 붙인다.
            // 내용이 바뀌면 파일명이 바뀌므로 캐시 무효화가 필요 없다.
            name: isProduction ? 'static/[name].[contenthash:8].[ext]' : 'static/[name].[ext]'
          }
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      // react 등 공통 의존성을 별도 청크로 모아, 페이지 청크가 이들과 분리되어도
      // 모듈 병합(ModuleConcatenation)이 깨지지 않도록 한다.
      // 병합이 깨지면 react-icons처럼 export가 많은 모듈에서 tree shaking이 실패한다.
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all'
      }
    }
  };
};
