const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name]-[contenthash].js',
    chunkFilename: '[name]-[contenthash].js',
    clean: true
  },
  devServer: {
    open: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './public', to: './public' },
        { from: './src/assets/fonts', to: './static' }
      ]
    }),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[name]-[contenthash].css'
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
        test: /\.(svg|woff2|png|jpg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()]
  }
};
