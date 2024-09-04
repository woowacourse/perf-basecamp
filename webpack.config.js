const path = require('path');
const os = require('os');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

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
  devtool: 'source-map',
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
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
        // 일반적인 CSS 파일을 처리하기 위한 규칙
        test: /\.css$/i,
        exclude: /\.module\.css$/i, // CSS Modules 파일 제외
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        // CSS Modules 파일을 처리하기 위한 규칙
        test: /\.module\.css$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 개발 모드에서는 'style-loader', 프로덕션 모드에서는 'MiniCssExtractPlugin.loader'
          {
            loader: 'css-loader',
            options: {
              modules: true,
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      // '...',
      new CssMinimizerPlugin({
        // CPU 멀티 프로세서 병렬화 옵션 (기본 값: true)
        parallel: true
      }),
      new TerserPlugin({
        terserOptions: {
          compress: {}
        }
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              'imagemin-gifsicle',
              'imagemin-jpegtran',
              'imagemin-pngquant',
              'imagemin-svgo'
            ]
          }
        }
      })
    ]
  }
};
