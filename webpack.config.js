const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },

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
        // use: ['style-loader', 'css-loader']
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|jpg|gif|mp4|png)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]'
        }
      }
    ]
  },

  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new ImageMinimizerPlugin({
      generator: [
        {
          implementation: ImageMinimizerPlugin.sharpGenerate,
          type: 'asset',
          filter: (_, sourcePath) => /\.png$/i.test(sourcePath),
          filename: 'static/[name]-480.webp',
          options: {
            encodeOptions: { webp: { quality: 40 } },
            resize: { width: 480 }
          }
        },
        {
          implementation: ImageMinimizerPlugin.sharpGenerate,
          type: 'asset',
          filter: (_, sourcePath) => /\.png$/i.test(sourcePath),
          filename: 'static/[name]-1200.webp',
          options: {
            encodeOptions: { webp: { quality: 40 } },
            resize: { width: 1200 }
          }
        },
        {
          implementation: ImageMinimizerPlugin.sharpGenerate,
          type: 'asset',
          filter: (_, sourcePath) => /\.png$/i.test(sourcePath),
          filename: 'static/[name].webp',
          options: {
            encodeOptions: { webp: { quality: 40 } },
            resize: { width: 1920 }
          }
        }
      ]
    })
  ],
  output: {
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  }
};
