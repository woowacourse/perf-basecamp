const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // react-icons의 ES modules을 우선시하여 tree-shaking 최적화
    mainFields: ['module', 'main']
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
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
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192, // 8KB 이상 파일만 압축
      minRatio: 0.8, // 압축률이 80% 이상일 때만 적용
      deleteOriginalAssets: false // 원본 파일 유지
    })
  ],
  // tree-shaking 최적화를 위한 설정
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        type: 'asset',
        generator: {
          filename: 'static/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // console.log 제거
            drop_debugger: true // debugger 제거
          },
          mangle: true, // 변수명 난독화
          format: {
            comments: false // 주석 제거
          }
        },
        extractComments: false // 별도 라이선스 파일 생성 안함
      })
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // vendor 라이브러리들을 별도 번들로 분리
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        // react-icons를 별도 번들로 분리하여 tree-shaking 효과 극대화
        reactIcons: {
          test: /[\\/]node_modules[\\/]react-icons[\\/]/,
          name: 'react-icons',
          chunks: 'all',
          priority: 10,
          // tree-shaking으로 인해 사용되지 않은 아이콘들이 제거됨
          enforce: true
        }
      }
    }
  }
};
