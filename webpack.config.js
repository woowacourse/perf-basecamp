const path = require('path');
const os = require('os');

const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageResizePlugin = require('webpack-image-resize-plugin');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    historyApiFallback: true
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new CompressionPlugin(),
    new MiniCssExtractPlugin({ linkType: false, filename: `css/[name].css` }),
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
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        type: 'asset'
      },
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset',

        generator: {
          filename: 'static/[hash].webp[query]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJSPlugin({
        parallel: os.cpus().length - 1
      }),
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true, optimizationLevel: 3, colors: 32 }],
              ['pngquant', { speed: 3, strip: true, quality: [0.1, 0.1], dithering: 0.1 }]
            ]
          }
        }
      }),
      new ImageResizePlugin({
        gifInfo: {
          scale: 0.5, // 플러그인에서 구현 안되어있네유...;
          toWebp: true
        },
        imgInfo: {
          width: 1920,
          height: 0, // height 고정 해제를 위해 높이 비활성화
          quality: 100,
          toWebp: true
        }
      })
    ]
  }
};
