const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, '/dist'),
      clean: true,
      assetModuleFilename: 'static/[name].[contenthash:8][ext]'
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
      ...(isProd ? [new MiniCssExtractPlugin()] : []),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: { encodeOptions: { jpeg: { quality: 80 }, webp: { quality: 80 } } }
        },
        generator: [
          {
            preset: 'webp', // ?as=webp -> 사진형, 애니메이션형 이미지에 사용
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: { encodeOptions: { webp: { quality: 80 } } }
          },
          {
            preset: 'webp-lossless', // ?as=webp-lossless -> 그래픽형 이미지에 사용
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: { encodeOptions: { webp: { lossless: true } } }
          }
        ]
      })
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
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g|gif|webp|avif)$/i,
          type: 'asset/resource'
        }
      ]
    },
    optimization: {
      minimizer: ['...', new CssMinimizerPlugin()]
    }
  };
};
