const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// css 파일 크기 최적화, 빈칸 공백 제거
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// CSS를 별도의 파일로 추출합니다. CSS가 포함된 JS 파일별로 CSS 파일을 생성합니다.
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 기본 설정으로 JavaScript 코드를 난독화 하고 debugger 구문을 제거, console.log를 제거하는 옵션도 있다.
const TerserPlugin = require('terser-webpack-plugin');
// 웹팩 번들 분석 플러그인
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// gzip 압축
const CompressionPlugin = require('compression-webpack-plugin');

const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].js',
    path: path.join(__dirname, '/dist'),
    clean: true,
    publicPath: '/'
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  devtool: isDevMode ? 'source-map' : false,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-report.json'
    }),
    new CompressionPlugin({
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
        use: [isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
        // "style-loader"와 MiniCssExtractPlugin.loader를 함께 사용하면 안됩니다!
        // mini-css-extract-plugin 플러그인은 JavaScript 파일 안에서 호출되는 스타일 코드를 청크(Chunk)에서 파일로 추출하므로 개발 중에는 플러그인을 사용하지 않는 것이 좋습니다. 즉, 개발이 끝난 후 배포 할 때 사용하면 좋습니다.
        // 개발 모드에서는 CSS를 여러 번 수정하고 DOM에 <style> 요소의 코드로 주입하는 것이 훨씬 빨리 작동하므로 "style-loader"를 사용하고, 배포 모드에서는 MiniCssExtractPlugin.loader를 사용하려면 다음과 같이 설정합니다.
        // css-loader webpack에서 .css 파일을 읽어들이기위해 사용하는 로더
        // style-loader <style>태그를 삽입하여 CSS에 DOM을 추가
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        loader: 'image-webpack-loader',
        enforce: 'pre'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|mp4)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/[name].[contenthash:8].[ext]'
        }
      }
    ]
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    minimize: true,
    minimizer: isDevMode
      ? []
      : [
          '...',
          new CssMinimizerPlugin(),
          new TerserPlugin({
            terserOptions: {
              compress: {
                // console.log를 제거하는 옵션
                drop_console: true
              }
            }
          })
        ]
  }
};
