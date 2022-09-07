const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'] },
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.join(__dirname, '/dist'),
    clean: true,
    assetModuleFilename: 'static/[name].[ext]'
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new WebpackBundleAnalyzer({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-report.json'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        },
        generator: {
          filename: '[name].[contenthash].js'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].webp'
        }
      },
      {
        test: /\.(gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].ext'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              'gifsicle',
              'pngquant',
              ['webp', { quality: 60, resize: { width: 1600, height: 0 } }]
            ]
          }
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
};
