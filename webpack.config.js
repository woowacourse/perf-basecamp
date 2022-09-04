const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
    open: false,
    historyApiFallback: true
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: true
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new CompressionPlugin(),
    new BundleAnalyzerPlugin()
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
        type: 'asset/resource',
        generator: {
          filename: 'static/[name].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: 'webp',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ['imagemin-webp']
            }
          }
        ]
      })
    ]
  }
};
