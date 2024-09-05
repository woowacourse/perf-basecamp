const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: '[name].[contenthash].js',
      path: path.join(__dirname, '/dist'),
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true
    },
    devtool: mode === 'development' ? 'source-map' : false,
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './public', to: './public' }]
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        excludeAssets: [/node_modules/]
      }),
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html)$/
      }),
      new Dotenv()
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
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|mp4)$/i,
          loader: 'file-loader',
          options: {
            name: 'static/[name].[contenthash].[ext]'
          }
        },
        {
          test: /\.css$/i,
          use: [mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    optimization: {
      usedExports: true,
      splitChunks: { chunks: 'all' },
      minimizer: ['...', new CssMinimizerPlugin()]
    }
  };
};
