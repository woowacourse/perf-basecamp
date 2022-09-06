const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const MiniCSSExtractionPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const CompressionPlugin = require('compression-webpack-plugin');

const DEVELOPMENT = 'development';
const mode = process.env.NODE_ENV || DEVELOPMENT;

module.exports = {
  mode,
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
    historyApiFallback: true
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true
      },
      template: './index.html',
      hash: true
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new MiniCSSExtractionPlugin({
      filename: '[name].css'
    }),
    new BundleAnalyzerPlugin(),
    new CompressionPlugin(),
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
        use: [MiniCSSExtractionPlugin.loader, 'css-loader']
      },
      {
        test: /\.(ttf|woff|woff2|mp4)$/i,
        type: 'asset',
        generator: {
          filename: 'static/[name]-[hash][ext]'
        }
      },
      {
        test: /\.(jpe?g|png)$/i,
        type: 'asset',
        generator: {
          filename: 'static/[name]-[hash].webp'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TerserPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true, optimizationLevel: 3 }],
              ['pngquant', { quality: [0.6, 0.8] }],
              ['webp', { quality: 40, resize: { width: 1920, height: 0 } }]
            ]
          }
        }
      })
    ]
  }
};
