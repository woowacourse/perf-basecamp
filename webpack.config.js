const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MinimizerPlugin = require('minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { cssMinify } = require('webpack').css.syntax;

const isProduction = process.env.NODE_ENV === 'production';
const imageGenerators = ['avif', 'gif', 'jpeg', 'png', 'webp'].map(format => ({
  preset: format,
  implementation: ImageMinimizerPlugin.sharpGenerate,
  filename: 'static/[name]-[width][ext]',
  options: {
    resize: {
      withoutEnlargement: true
    },
    encodeOptions: {
      [format]: {
        quality: 65
      }
    }
  }
}));

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    chunkFilename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
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
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].css'
          })
        ]
      : [])
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
        use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]'
        }
      },
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif)$/i,
        oneOf: [
          {
            resourceQuery: /(?:\?|&)ffmpeg(?:&|$)/,
            type: 'javascript/auto',
            loader: path.resolve(__dirname, 'loaders/ffmpeg-video-loader.js')
          },
          {
            resourceQuery: /(?:\?|&)sharp(?:&|$)/,
            type: 'asset/resource',
            loader: ImageMinimizerPlugin.loader,
            options: {
              generator: imageGenerators
            },
            generator: {
              filename: 'static/[name][ext]'
            }
          },
          {
            type: 'asset/resource',
            generator: {
              filename: 'static/[name][ext]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      '...',
      new MinimizerPlugin({
        test: /\.css(\?.*)?$/i,
        minify: {
          implementation: cssMinify
        }
      })
    ]
  }
};
