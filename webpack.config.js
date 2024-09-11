const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// image lossless minify
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

// analyzing bundle size
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    index: {
      import: './src/index.tsx'
    },
    home: {
      import: './src/pages/Home/Home.tsx'
    },
    search: {
      import: './src/pages/Search/Search.tsx'
    },

    react: {
      import: './node_modules/react'
    }
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '/dist'),
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
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      },
      {
        rules: [
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            type: 'asset'
          }
        ]
      }
    ]
  },
  optimization: {
    // js minify
    minimize: true,
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: ['imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant', 'imagemin-svgo']
          }
        },
        generator: [
          {
            // You can apply generator using `?as=webp`, you can use any name and provide more options
            preset: 'webp',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: {
                // Please specify only one codec here, multiple codecs will not work
                webp: {
                  quality: 1
                }
              }
            }
          }
        ]
      }),
      '...'
    ]
  }
};
