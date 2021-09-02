const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCSSExtractionPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const chunkFileNames = ['service_fetchGif', 'page_Search'];

const DEVELOPMENT = 'development';

const mode = process.env.NODE_ENV || DEVELOPMENT;

module.exports = {
  mode,
  entry: './src/index.js',
  resolve: { extensions: ['.js', '.jsx'] },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: (pathData) => {
      return chunkFileNames.includes(pathData.chunk.name)
        ? '[name].js'
        : '[id].js';
    },
    path: path.join(__dirname, '/dist'),
    clean: true,
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
  },
  devtool: 'source-map',
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true, // 빈칸 제거
        removeComments: true, // 주석 제거
      },
      template: './index.html',
      hash: true, // 결과물 index.html 이 매 빌드마다 다른 queryString과 함께 bundle.js 를 불러들이도록 함으로써 파일이 동일하지 않다는 것을 알림 - 캐싱 방지
    }),
    new MiniCSSExtractionPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './public', to: './public' },
        {
          from: './src/assets/font',
          to: './font',
        },
      ],
    }),
    new Dotenv(),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCSSExtractionPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        loader: 'image-webpack-loader',
        enforce: 'pre',
      },
      {
        test: /\.(svg|ttf|png|jpg|gif|webp)$/i,
        loader: 'url-loader',
        options: {
          name: 'static/[name].[ext]',
          limit: 10 * 1024,
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          name: 'static/[name].[ext]',
          limit: 10 * 1024,
          noquotes: true,
        },
      },
    ],
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
