const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

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
    historyApiFallback: true,
    port: 9000
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      exclude: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|txt|map|ico)$/i
    }),
    //new BundleAnalyzerPlugin(),
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
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        loader: 'image-webpack-loader',
        options: {
          pngquant: {
            quality: [0.01, 0.01],
            speed: 4
          },
          gifsicle: {
            interlaced: true,
            optimizationLevel: 3,
            colors: 32
          }
        }
      }
    ]
  }
};
