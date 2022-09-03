const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist'),
    clean: true,
    assetModuleFilename: '[name][ext][query]'
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
    new MiniCssExtractPlugin(),
    new ImageminWebpWebpackPlugin(),
    new CompressionPlugin({ algorithm: 'gzip' }),
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015'
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   loader: ImageMinimizerPlugin.loader,
      //   enforce: 'pre',
      //   options: {
      //     generator: [
      //       {
      //         preset: 'webp',
      //         implementation: ImageMinimizerPlugin.squooshGenerate,
      //         options: {
      //           plugins: ['imagemin-webp'],
      //           encodeOptions: {
      //             // Please specify only one codec here, multiple codecs will not work
      //             resize: {
      //               enabled: true,
      //               width: 100,
      //               height: 50
      //             },
      //             encodeOptions: {
      //               webp: {
      //                 quality: 40
      //               }
      //             }
      //           }
      //         }
      //       }
      //       // {
      //       //   preset: 'png',
      //       //   implementation: ImageMinimizerPlugin.imageminGenerate,
      //       //   options: {
      //       //     plugins: ['imagemin-pngquant']
      //       //   }
      //       // }
      //     ]
      //   }
      // },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        type: 'asset'
      }
    ]
  },
  optimization: {
    minimize: true,

    minimizer: [
      '...',
      new ImageminWebpWebpackPlugin({
        generator: [
          {
            preset: 'webp',
            implementation: ImageminWebpWebpackPlugin.imageminGenerate,
            options: {
              plugins: [['webp', { quality: 30 }]]
            }
          }
        ],
        minimizer: {
          implementation: ImageminWebpWebpackPlugin.imageminMinify,
          options: {
            plugins: [
              ['pngquant', { optimizationLevel: 20 }] // lossless PNG optimization
            ]
          }
        }
      }),
      new TerserPlugin({}),
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true // Apply minification to CSS assets
      })
    ]
  }
};
