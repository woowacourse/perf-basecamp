import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { fileURLToPath } from 'url';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (_, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: isProd ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
      path: path.join(__dirname, '/dist'),
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
      static: { directory: path.join(__dirname, 'src/assets'), publicPath: '/assets' }
    },
    devtool: isProd ? false : 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './public', to: './public' },
          { from: './robots.txt', to: './' }
        ]
      }),
      new Dotenv(),
      ...(process.env.ANALYZE
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
              reportFilename: 'bundle-report.html',
              generateStatsFile: true,
              statsFilename: 'bundle-stats.json'
            })
          ]
        : [])
    ],
    module: {
      rules: [
        {
          test: /\.(mp4|webm|ogg|mov)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'public/videos/[name][ext]'
          }
        },
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
          test: /\.(png|jpe?g|webp|gif|svg|eot|ttf|woff2?)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'public/images/[name][ext]'
          }
        }
      ]
    },
    optimization: {
      minimize: isProd,
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: 'single'
    }
  };
};
