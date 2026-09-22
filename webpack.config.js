const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv && argv.mode === 'production';
  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: '[name].[contenthash:8].js',
      chunkFilename: '[name].[contenthash:8].chunk.js',
      path: path.join(__dirname, '/dist'),
      clean: true,
      publicPath: 'auto'
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
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: '[name].[contenthash:8].css',
              chunkFilename: '[name].[contenthash:8].css'
            })
          ]
        : [])
    ],
    optimization: {
      minimizer: ['...', ...(isProd ? [new CssMinimizerPlugin()] : [])]
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[contenthash:8].[ext]'
        }
      }
    ]
  }
  };
};
