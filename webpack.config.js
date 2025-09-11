const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: { '@': path.resolve(__dirname, 'src') }
    },
    output: {
      filename: isProd ? 'bundle.[contenthash].js' : '[name].js',
      chunkFilename: isProd ? '[name].[contenthash].js' : '[name].js',
      path: path.join(__dirname, '/dist'),
      publicPath: '/',
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true
    },
    devtool: isProd ? false : 'source-map',
    plugins: [
      new HtmlWebpackPlugin({ template: './index.html' }),
      new CopyWebpackPlugin({ patterns: [{ from: './public', to: './public' }] }),
      new Dotenv(),
      ...(isProd
        ? [
            new MiniCssExtractPlugin({
              filename: 'styles.[contenthash].css',
              chunkFilename: 'styles.[id].[contenthash].css'
            })
          ]
        : [])
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/i,
          exclude: /node_modules/,
          use: { loader: 'ts-loader' }
        },
        {
          test: /\.css$/i,
          use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g|gif|webp)$/i,
          type: 'asset/resource',
          generator: { filename: 'static/media/[name].[contenthash][ext]' }
        }
      ]
    },
    optimization: {
      minimize: isProd,
      minimizer: ['...', new CssMinimizerPlugin()],
      splitChunks: { chunks: 'all' },
      runtimeChunk: 'single'
    }
  };
};
