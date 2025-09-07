// 필요한 패키지들 import
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // HTML 파일 생성 및 최적화
const Dotenv = require('dotenv-webpack'); // 환경변수 관리
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 정적 파일 복사
const CompressionPlugin = require('compression-webpack-plugin'); // Gzip 압축
const TerserPlugin = require('terser-webpack-plugin'); // JavaScript 압축/난독화
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 번들 분석

module.exports = {
  // 진입점: 애플리케이션의 시작 파일
  entry: './src/index.tsx',

  // 모듈 해석 설정
  resolve: {
    // 확장자 생략 가능한 파일 타입들
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    // react-icons의 ES modules을 우선시하여 tree-shaking 최적화
    mainFields: ['module', 'main'],
    // react-icons의 정확한 경로 해석을 위한 설정
    alias: {
      'react-icons/ai': 'react-icons/ai/index.esm.js'
    }
  },

  // 출력 설정
  output: {
    // 메인 번들 파일명 (해시 포함으로 캐싱 최적화)
    filename: '[name].[contenthash].js',
    // 청크 파일명 (코드 분할된 파일들)
    chunkFilename: '[name].[contenthash].js',
    // 출력 디렉토리
    path: path.join(__dirname, '/dist'),
    // 빌드 전 기존 dist 폴더 정리
    clean: true
  },

  // 개발 서버 설정
  devServer: {
    hot: true, // Hot Module Replacement 활성화
    open: true, // 빌드 후 브라우저 자동 열기
    historyApiFallback: true // SPA 라우팅을 위한 히스토리 API 폴백
  },

  // 소스맵 생성 설정 (디버깅용)
  devtool: 'source-map',
  // 플러그인 설정
  plugins: [
    // HTML 파일 생성 및 최적화
    new HtmlWebpackPlugin({
      template: './index.html', // HTML 템플릿 파일
      minify: {
        removeComments: true, // HTML 주석 제거
        collapseWhitespace: true, // 공백 제거
        removeRedundantAttributes: true, // 중복 속성 제거
        useShortDoctype: true, // 짧은 DOCTYPE 사용
        removeEmptyAttributes: true, // 빈 속성 제거
        removeStyleLinkTypeAttributes: true, // style/link type 속성 제거
        keepClosingSlash: true, // 닫는 슬래시 유지
        minifyJS: true, // 인라인 JavaScript 압축
        minifyCSS: true, // 인라인 CSS 압축
        minifyURLs: true // URL 압축
      }
    }),

    // 정적 파일 복사 (public 폴더 → dist/public)
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),

    // 환경변수 로드 (.env 파일)
    new Dotenv(),

    // Gzip 압축 플러그인
    new CompressionPlugin({
      algorithm: 'gzip', // 압축 알고리즘
      test: /\.(js|css|html|svg)$/, // 압축할 파일 타입
      threshold: 8192, // 8KB 이상 파일만 압축
      minRatio: 0.8, // 압축률이 80% 이상일 때만 적용
      deleteOriginalAssets: false // 원본 파일 유지
    }),

    // 번들 분석기 (환경변수로 제어)
    ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : [])
  ],
  // 빌드 모드 설정 (production/development)
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  // 모듈 처리 규칙
  module: {
    rules: [
      {
        // JavaScript/TypeScript 파일 처리
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/, // node_modules 제외
        use: {
          loader: 'ts-loader' // TypeScript 컴파일러
        }
      },
      {
        // CSS 파일 처리
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'] // CSS를 JS에 주입하고 CSS 파싱
      },
      {
        // 정적 자산 파일 처리 (이미지, 폰트 등)
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp)$/i,
        type: 'asset/resource', // 파일을 별도 리소스로 처리
        generator: {
          filename: 'static/[name].[contenthash][ext]' // 파일명에 해시 포함
        }
      }
    ]
  },
  // 최적화 설정
  optimization: {
    // 프로덕션 모드에서만 코드 압축
    minimize: process.env.NODE_ENV === 'production',

    // 압축 도구 설정
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production', // production에서만 console.log 제거
            drop_debugger: true // debugger 제거
          },
          mangle: true, // 변수명 난독화
          format: {
            comments: false // 주석 제거
          }
        },
        extractComments: false // 별도 라이선스 파일 생성 안함
      })
    ],

    // 코드 분할 설정
    splitChunks: {
      chunks: 'all', // 모든 청크에 대해 분할 적용
      cacheGroups: {
        // vendor 라이브러리들을 별도 번들로 분리
        vendor: {
          test: /[\\/]node_modules[\\/]/, // node_modules 파일들
          name: 'vendors', // 번들명
          chunks: 'all' // 모든 청크에서 분리
        },
        // react-icons를 별도 번들로 분리하여 tree-shaking 효과 극대화
        reactIcons: {
          test: /[\\/]node_modules[\\/]react-icons[\\/]/, // react-icons 라이브러리
          name: 'react-icons', // 번들명
          chunks: 'async', // 비동기 청크에서만 분리 (더 나은 tree-shaking)
          priority: 10, // 우선순위 (높을수록 먼저 적용)
          // tree-shaking으로 인해 사용되지 않은 아이콘들이 제거됨
          enforce: true, // 강제 적용
          minSize: 0, // 최소 크기 제한 없음
          maxSize: 5000 // 최대 5KB로 제한
        }
      }
    }
  }
};
