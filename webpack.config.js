const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = (env) => {
  const mode = process.env.NODE_ENV || 'development';

  const config = {
    entry: './src/index.js',
    resolve: { extensions: ['.js', '.jsx'] },
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.join(__dirname, '/dist'),
      clean: true,
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
    },
    devtool: mode === 'development' ? 'inline-source-map' : false,
    plugins: [
      new HtmlWebpackPlugin({
        minify: {
          collapseWhitespace: true,
          removeComments: true,
        },
        template: './index.html',
        hash: true,
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './public', to: './public' }],
      }),
      new Dotenv(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html',
        openAnalyzer: false,
      }),
      new webpack.DefinePlugin({}),
      new ImageMinimizerPlugin({
        exclude: /node_modules/,
        minimizerOptions: {
          plugins: ['pngquant'],
        },
      }),
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
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|mp4|webm)$/i,
          loader: 'file-loader',
          options: {
            name: 'static/[name].[ext]',
          },
        },
        {
          test: /hero\.(png|webp)$/i,
          use: [
            'file-loader',
            {
              loader: 'webpack-image-resize-loader',
              options: {
                width: 1320,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimize: mode === 'development' ? false : true,
      minimizer: [`...`, new CssMinimizerPlugin()],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          defaultVendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            priority: 30,
          },
          asynchronous: {
            chunks: 'async',
            name: 'asynchronous',
            priority: 20,
          },
          commons: {
            name: 'commons',
            minChunks: 1,
            priority: 10,
          },
        },
      },
    },
  };

  if (mode === 'production') {
    config.plugins.push(
      new MiniCssExtractPlugin({
        linkType: 'text/css',
        filename: `[name].css`,
      })
    );
  }

  config.module.rules.push({
    test: /\.css$/i,
    exclude: /node_modules/,
    use: [
      mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
    ],
  });

  return config;
};
