const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.tsx',
  mode: isProduction ? 'production' : 'development',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: isProduction ? 'chunks/[name].[contenthash].js' : 'chunks/[name].js',
    chunkFilename: isProduction ? 'chunks/[name].[contenthash].js' : 'chunks/[name].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  devtool: isProduction ? false : 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
            chunkFilename: 'styles/[name].[contenthash].css'
          }),
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 8192,
            minRatio: 0.8,
            deleteOriginalAssets: false
          }),
          new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.sharpMinify,
              options: {
                encodeOptions: {
                  jpeg: { quality: 75, progressive: true },
                  png: { quality: 80, palette: true }
                }
              }
            },
            generator: [
              {
                type: 'asset',
                implementation: ImageMinimizerPlugin.sharpGenerate,
                options: {
                  encodeOptions: { webp: { quality: 75 } }
                },
                filename: 'static/[name].webp',
                filter: (source, sourcePath) => /\.(png|jpe?g)$/i.test(sourcePath)
              }
            ]
          }),
          ...(isProduction
            ? process.env.ANALYZE === 'true'
              ? [
                  new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    reportFilename: 'report.html'
                  })
                ]
              : []
            : [])
        ]
      : [])
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
        use: [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
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
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    runtimeChunk: 'single',
    minimize: isProduction,
    minimizer: isProduction
      ? [
          new TerserPlugin({
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.info', 'console.debug', 'console.warn'],
                dead_code: true,
                unused: true
              },
              mangle: {
                safari10: true
              },
              format: {
                comments: false
              }
            }
          }),
          new CssMinimizerPlugin({
            minimizerOptions: {
              preset: [
                'default',
                {
                  discardComments: { removeAll: true },
                  normalizeWhitespace: true,
                  colormin: true,
                  convertValues: true,
                  mergeLonghand: true,
                  mergeRules: true
                }
              ]
            }
          })
        ]
      : []
  }
};
