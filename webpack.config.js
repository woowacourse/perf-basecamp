const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public')
    }
  },
  devtool: 'source-map',
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    // Tree shaking 최적화
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // react-icons를 별도 청크로 분리하여 Tree Shaking 최적화
        reactIcons: {
          test: /[\\/]node_modules[\\/]react-icons[\\/]/,
          name: 'react-icons',
          chunks: 'all',
          priority: 20,
          enforce: true,
          // react-icons의 tree-shaking을 위한 추가 설정
          minSize: 0,
          maxSize: 100000
        },
        // vendor 라이브러리 (react-icons 제외)
        vendor: {
          test: /[\\/]node_modules[\\/](?!react-icons)/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        // 공통 코드
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
