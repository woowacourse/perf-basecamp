const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const isDevMode = process.env.NODE_ENV?.includes('dev');

const plugins = [
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development'
  }),
  new HtmlWebpackPlugin({
    template: './index.html'
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: './public', to: './public' }]
  }),
  new CompressionPlugin({
    algorithm: 'gzip'
  }),
  new Dotenv(),
  new MiniCssExtractPlugin()
];

if (!isDevMode) {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    })
  );
}

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
  plugins,
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
        use: [isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },

      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              optipng: {
                enabled: true
              },
              enforce: 'pre'
            }
          },
          {
            loader: 'webp-loader',
            options: {
              quality: 80
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: !isDevMode,
    minimizer: [`...`, new CssMinimizerPlugin()]
  }
};
