import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { fileURLToPath } from 'url';
import sharpAdapter from 'responsive-loader/sharp.js';
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
      historyApiFallback: true
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './public', to: './public' }]
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
          test: /\.(png|jpe?g)$/i,
          type: 'javascript/auto',
          use: [
            {
              loader: 'responsive-loader',
              options: {
                adapter: sharpAdapter,
                name: 'static/[name]-[width].[contenthash:8].[ext]',
                size: 1280,
                format: 'webp',
                quality: 50,
                esModule: true
              }
            }
          ]
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
          test: /\.(gif|svg|eot|ttf|woff2?)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024
            }
          },
          generator: {
            filename: 'static/[name].[contenthash:8].[ext]'
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
