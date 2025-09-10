const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    // 번들 파일 명은 해시 값을 포함하여 캐싱 무효화 처리
    filename: '[name].[contenthash].js',
    // asset/resource 타입 파일명 형식
    assetModuleFilename: './static/[name][contenthash][ext]'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  module: {
    rules: [
      {
        // CSS 파일은 MiniCssExtractPlugin.loader + css-loader 사용해 처리
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 모든 청크에 대해 코드 분할 적용
      minSize: 20000, // 최소 분할 크기 (20KB)
      maxSize: 50000, // 최대 분할 크기 (50KB)
      minChunks: 1, // 최소 참조 횟수 (1회 이상 사용된 모듈 분리)
      maxAsyncRequests: 30, // 비동기 요청 최대 수
      maxInitialRequests: 30, // 초기 요청 최대 수
      automaticNameDelimiter: '~', // 자동 생성 청크 이름 구분자
      cacheGroups: {
        // React 관련 라이브러리 별도 분리
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 30
        },
        // vendor 라이브러리 별도 분리
        vendor: {
          test: /[\\/]node_modules[\\/](?!(react|react-dom)[\\/])/,
          name: 'vendor',
          chunks: 'all',
          priority: 20
        },
        // 공통 모듈 분리
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 10,
          reuseExistingChunk: true
        }
      }
    },
    // 런타임 코드 별도 청크로 분리 (캐싱 효율 개선)
    runtimeChunk: {
      name: 'single'
    },
    minimize: true,
    minimizer: [
      // JS 코드 난독화/압축
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // console.log 제거
            drop_debugger: true // debugger 제거
          },
          format: {
            comments: false // 모든 주석 제거
          }
        },
        extractComments: false // 주석을 별도 파일로 추출하지 않음
      }),
      // CSS 코드 압축
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        deleteOriginalAssets: false,
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify
        },
        generator: [
          {
            preset: 'avif-pc',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: { avif: { quality: 50 } },
              resize: { enabled: true, width: 1920 }
            }
          },
          {
            preset: 'avif-tablet',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: { avif: { quality: 50 } },
              resize: { enabled: true, width: 1024 }
            }
          },
          {
            preset: 'avif-mobile',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: { avif: { quality: 50 } },
              resize: { enabled: true, width: 768 }
            }
          },
          {
            preset: 'webp-pc',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: { webp: { quality: 75 } },
              resize: { enabled: true, width: 1920 }
            }
          },
          {
            preset: 'webp-tablet',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: { webp: { quality: 75 } },
              resize: { enabled: true, width: 1024 }
            }
          },
          {
            preset: 'webp-mobile',
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              encodeOptions: { webp: { quality: 75 } },
              resize: { enabled: true, width: 768 }
            }
          }
        ]
      })
    ]
  }
});
