const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlInlineCssWebpackPlugin = require('html-inline-css-webpack-plugin').default;

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: 'bundle.[contenthash].js',
    chunkFilename: '[name].[contenthash].bundle.js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new HtmlWebpackPlugin({
      template: './404.template.html',
      filename: '404.html'
    }),
    new HtmlInlineCssWebpackPlugin({ leaveCSSFile: true }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          to: './public',
          globOptions: { ignore: ['**/robots.txt'] }
        },
        { from: './public/robots.txt', to: '.' }
      ]
    }),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css'
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg)$/i,
        resourceQuery: /webp/,
        use: {
          loader: 'responsive-loader',
          options: {
            adapter: require('responsive-loader/sharp'),
            sizes: [1280],
            format: 'webp',
            quality: 70,
            name: 'static/[name]-[width].[ext]',
            esModule: false
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|mp4)$/i,
        resourceQuery: { not: /webp/ },
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[contenthash:8][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: ['...', new CssMinimizerPlugin()]
  }
};
