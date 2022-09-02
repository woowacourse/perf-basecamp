const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

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
    new ImageminWebpWebpackPlugin()
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
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: ImageMinimizerPlugin.loader,
        enforce: 'pre',
        options: {
          generator: [
            {
              preset: 'webp',
              implementation: ImageMinimizerPlugin.squooshGenerate,
              options: {
                plugins: ['imagemin-webp'],
                encodeOptions: {
                  // Please specify only one codec here, multiple codecs will not work
                  resize: {
                    enabled: true,
                    width: 100,
                    height: 50
                  },
                  encodeOptions: {
                    webp: {
                      quality: 40
                    }
                  }
                }
              }
            }
            // {
            //   preset: 'png',
            //   implementation: ImageMinimizerPlugin.imageminGenerate,
            //   options: {
            //     plugins: ['imagemin-pngquant']
            //   }
            // }
          ]
        }
      },
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
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true // Apply minification to CSS assets
      })
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.imageminMinify,
      //     options: {
      //       plugins: [
      //         // ['gifsicle', { interlaced: true, optimizationLevel: 3, colors: 64 }],
      //         ['pngquant', { speed: 3, strip: true, quality: [0.1, 0.3], dithering: 0.1 }],
      //         ['webp', { quality: 50, resize: { width: 1280, height: 0 } }]
      //       ]
      //     }
      //   }
      // })
      // new ImageMinimizerPlugin({
      //   // generator: [
      //   //   {
      //   //     type: 'asset',
      //   //     implementation: ImageMinimizerPlugin.imageminGenerate,
      //   //     options: {
      //   //       plugins: ['imagemin-pngquant', 'imagemin-webp']
      //   //     }
      //   //   }
      //   // ],
      //   // generator: [
      //   //   {
      //   //     // You can apply generator using `?as=avif`, you can use any name and provide more options
      //   //     preset: 'avif',
      //   //     implementation: ImageMinimizerPlugin.squooshGenerate,
      //   //     options: {
      //   //       encodeOptions: {
      //   //         avif: {
      //   //           cqLevel: 33
      //   //         }
      //   //       }
      //   //     }
      //   //   },
      //   //   {
      //   //     // You can apply generator using `?as=webp`, you can use any name and provide more options
      //   //     preset: 'webp',
      //   //     implementation: ImageMinimizerPlugin.squooshGenerate,
      //   //     options: {
      //   //       encodeOptions: {
      //   //         // Please specify only one codec here, multiple codecs will not work
      //   //         webp: {
      //   //           quality: 100
      //   //         },
      //   //         pngquant: {
      //   //           quality: 10
      //   //         }
      //   //       }
      //   //     }
      //   //   }
      //   // ],
      // new ImageMinimizerPlugin({
      //   minimizer: {
      //     implementation: ImageMinimizerPlugin.squooshMinify,
      //     options: {
      //       plugins: [
      //         ['gifsicle', { interlaced: true }],
      //         ['optipng', { optimizationLevel: 10, quality: 10 }],
      //         ['webp', { quality: 50, resize: { width: 1280, height: 0 } }]
      //       ]
      //     }
      //   }
      // })
      // })
    ]
  }
};
