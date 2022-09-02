const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const AggresiveWebpackPlugin = require('webpack/lib/optimize/AggressiveSplittingPlugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[chunkhash].js',
    chunkFilename: '[chunkhash].js',
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new AggresiveWebpackPlugin({
      // https://webpack-v3.jsx.app/plugins/aggressive-splitting-plugin/
      minSize: 30000, // Byte, split point. Default: 30720
      maxSize: 50000, // Byte, maxsize of per file. Default: 51200
      chunkOverhead: 0, // Default: 0
      entryChunkMultiplicator: 1 // Default: 1
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
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      }
    ]
  },
  optimization: {}
};
