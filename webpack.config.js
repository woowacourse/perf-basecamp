const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const webpack = require('webpack');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
      {
        test: /\.css$/i,
        use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|webm|mp4)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[ext]'
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
      NODE_ENV: isProd ? JSON.stringify('production') : JSON.stringify('development')
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: true
    })
  ],
  optimization: {
    minimizer: isProd
      ? [
          '...',
          new CssMinimizerPlugin(),
          new ImageMinimizerPlugin({
            deleteOriginalAssets: false,
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminGenerate,
              options: {
                plugins: [['webp', { preset: 'photo', quality: 40 }]]
              }
            }
          })
        ]
      : []
  }
};
