const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// css minify
const os = require('os');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// image lossless minify
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

// analyzing bundle size
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// gzip plugin
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  // entry: './src/index.tsx',
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
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new MiniCssExtractPlugin(),
    new BundleAnalyzerPlugin(),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
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
      // 플러그인 인스턴스 생성
      new CssMinimizerPlugin({
        // CPU 멀티 프로세서 병렬화 옵션 (기본 값: true)
        parallel: os.cpus().length - 1
      }),
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
