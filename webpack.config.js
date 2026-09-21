const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}, argv = {}) => {
  const isProduction = argv.mode === 'production';
  // The dedicated CloudFront distribution serves the S3 prefix at the domain root.
  const publicPath = env.publicPath ?? process.env.PUBLIC_PATH ?? '/';
  if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(publicPath)) {
    throw new Error('PUBLIC_PATH must be / or a path such as /lumen/ with a trailing slash.');
  }

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: 'static/[name].[contenthash:8].js',
      chunkFilename: 'static/[name].[contenthash:8].js',
      assetModuleFilename: 'static/[name].[contenthash:8][ext]',
      path: path.join(__dirname, 'dist'),
      publicPath,
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      compress: true,
      historyApiFallback: true
    },
    devtool: isProduction ? false : 'eval-cheap-module-source-map',
    plugins: [
      new HtmlWebpackPlugin({ template: './index.html', templateParameters: { publicPath } }),
      new DefinePlugin({ 'process.env.PUBLIC_PATH': JSON.stringify(publicPath) }),
      new CopyWebpackPlugin({ patterns: [{ from: './public', to: './public' }] }),
      new Dotenv(),
      ...(isProduction
        ? [new MiniCssExtractPlugin({ filename: 'static/[name].[contenthash:8].css' })]
        : []),
      ...(env.analyze
        ? [new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })]
        : [])
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            // TypeScript must retain webpack's dynamic-import chunk-name comment.
            options: { compilerOptions: { removeComments: false } }
          }
        },
        {
          test: /\.css$/i,
          use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff2?|png|jpe?g|gif|webp|mp4)$/i,
          type: 'asset/resource'
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      // Keep webpack's Terser minimizer, including unused icon removal.
      minimizer: ['...', new CssMinimizerPlugin()],
      splitChunks: { chunks: 'all' },
      runtimeChunk: 'single'
    }
  };
};
