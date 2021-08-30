const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env) => {
  const mode = process.env.NODE_ENV || 'development';

  const config = {
    entry: './src/index.js',
    resolve: { extensions: ['.js', '.jsx'] },
    output: {
      filename: 'bundle.js',
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
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          loader: 'file-loader',
          options: {
            name: 'static/[name].[ext]',
          },
        },
      ],
    },
    optimization: {
      minimize: mode === 'development' ? false : true,
      minimizer: [`...`, new CssMinimizerPlugin()],
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
