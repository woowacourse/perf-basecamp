const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const glob = require('glob');

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // react-icons의 ES modules을 우선시하여 tree-shaking 최적화
    mainFields: ['module', 'main']
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
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
    // CSS 파일을 별도로 추출 (프로덕션 모드에서만)
    ...(process.env.NODE_ENV === 'production'
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
          }),
          // 사용하지 않는 CSS 제거
          new PurgeCSSPlugin({
            paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
            safelist: {
              standard: [
                // 동적으로 생성되는 클래스명들
                /^react-/,
                /^giphy-/,
                /^loading-/,
                /^error-/,
                /^success-/,
                // CSS 모듈 클래스들
                /^[a-zA-Z0-9-_]+$/
              ],
              deep: [/^[a-zA-Z0-9-_]+$/],
              greedy: [/^[a-zA-Z0-9-_]+$/]
            }
          })
        ]
      : []),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192, // 8KB 이상 파일만 압축
      minRatio: 0.8, // 압축률이 80% 이상일 때만 적용
      deleteOriginalAssets: false // 원본 파일 유지
    })
  ],
  // tree-shaking 최적화를 위한 설정
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
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
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        type: 'asset',
        generator: {
          filename: 'static/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    runtimeChunk: 'single',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // console.log 제거
            drop_debugger: true // debugger 제거
          },
          mangle: true, // 변수명 난독화
          format: {
            comments: false // 주석 제거
          }
        },
        extractComments: false // 별도 라이선스 파일 생성 안함
      }),
      // CSS 압축 및 최적화
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }, // CSS 주석 제거
              normalizeWhitespace: true, // 공백 정규화
              colormin: true, // 색상 최적화
              minifySelectors: true // 셀렉터 최적화
            }
          ]
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // vendor 라이브러리들을 별도 번들로 분리
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        // react-icons를 별도 번들로 분리하여 tree-shaking 효과 극대화
        reactIcons: {
          test: /[\\/]node_modules[\\/]react-icons[\\/]/,
          name: 'react-icons',
          chunks: 'all',
          priority: 10,
          // tree-shaking으로 인해 사용되지 않은 아이콘들이 제거됨
          enforce: true
        },
        // CSS 파일을 별도로 분리
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
          priority: 20
        }
      }
    }
  }
};
