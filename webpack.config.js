const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    client: { overlay: false }
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new Dotenv()
    // new BundleAnalyzerPlugin()
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
        // 일반적인 CSS 파일을 처리하기 위한 규칙
        test: /\.css$/i,
        exclude: /\.module\.css$/i, // CSS Modules 파일 제외
        use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        // CSS Modules 파일을 처리하기 위한 규칙
        test: /\.module\.css$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 개발 모드에서는 'style-loader', 프로덕션 모드에서는 'MiniCssExtractPlugin.loader'
          {
            loader: 'css-loader',
            options: {
              modules: true,
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          enforce: true
        }
      }
    },
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin({
        // CPU 멀티 프로세서 병렬화 옵션 (기본 값: true)
        parallel: true
      }),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false // 모든 주석 제거
          },
          compress: {
            drop_console: true // 빌드 시, console.* 구문 코드 제거
          }
        },
        extractComments: false // license.txt 파일 생성을 방지
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              [
                'imagemin-gifsicle',
                {
                  interlaced: true, // 인터레이스 형식으로 설정
                  optimizationLevel: 1 // 최적화 수준 설정 (0~3, 기본값: 1)
                }
              ],
              'imagemin-mozjpeg',
              'imagemin-pngquant',
              'imagemin-svgo'
            ]
          }
        },
        // loader: false,
        generator: [
          {
            // type: 'asset',
            preset: 'webp',
            implementation: ImageMinimizerPlugin.sharpGenerate, // `sharp`으로 변경
            options: {
              encodeOptions: {
                webp: {
                  quality: 75,
                  animated: true // 애니메이션 WebP 생성 옵션
                }
              }
            }
          }
        ]
      })
    ]
  },
  performance: { hints: 'warning', maxEntrypointSize: 60000 }
};
