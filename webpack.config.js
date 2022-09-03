const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    port: 3000
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './public', to: './public' },
        {
          from: './node_modules/loading-attribute-polyfill/dist/loading-attribute-polyfill.css',
          to: 'loading-attribute-polyfill.css'
        },
        {
          from: './node_modules/loading-attribute-polyfill/dist/loading-attribute-polyfill.umd.js',
          to: 'loading-attribute-polyfill.js'
        }
      ]
    }),
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|gif)$/i,
        type: 'asset',

        generator: {
          filename: 'static/[contenthash].webp[query]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['giflossy', { interlaced: true, optimizationLevel: 3, color: 200, lossy: 60 }],
              ['pngquant', { quality: [0.4, 0.6] }],
              ['webp', { quality: 60, resize: { width: 1200, height: 0 } }]
            ]
          }
        }
      })
    ]
  }
};
