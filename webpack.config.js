const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

module.exports = () => {
  const mode = process.env.NODE_ENV || 'development';

  return {
    entry: './src/index.js',
    resolve: { extensions: ['.js', '.jsx'] },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].[chunkhash].js',
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
      new HtmlWebpackPlugin({
        minify: {
          collapseWhiteSpace: true,
          removeComments: true,
        },
        hash: true,
        template: './index.html',
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './public', to: './public' }],
      }),
      new MiniCssExtractPlugin({
        filename: `[name].css`,
      }),
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css)$/,
      }),
      new webpack.DefinePlugin({}),
      new Dotenv(),
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: [
            mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name][ext]',
          },
        },
        {
          test: /\.mp4$/,
          type: 'asset/resource',
          generator: {
            filename: 'video/[name][ext]',
          },
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'image/[name][ext]',
          },
        },
      ],
    },
    optimization: {
      splitChunks: { chunks: 'all' },
      minimizer: [new CssMinimizerPlugin(), '...'],
    },
  };
};
