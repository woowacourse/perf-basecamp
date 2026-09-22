const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';
  const isAnalyze = process.env.ANALYZE === 'true';

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, '/dist'),
      clean: true
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true
    },
    devtool: isProduction ? false : 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './public', to: './public' }]
      }),
      new Dotenv(),
      ...(isAnalyze
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: 'report.html',
              openAnalyzer: true,
              generateStatsFile: true,
              statsFilename: 'stats.json'
            })
          ]
        : [])
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
          test: /\.(eot|svg|ttf|woff|woff2|png|jpe?g|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name][ext]'
          }
        }
      ]
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        '...',
        new ImageMinimizerPlugin({
          generator: [
            {
              preset: 'hero-webp',
              implementation: ImageMinimizerPlugin.sharpGenerate,
              options: {
                resize: {
                  width: 1600
                },
                encodeOptions: {
                  webp: {
                    quality: 60,
                    effort: 6
                  }
                }
              }
            },
            {
              preset: 'animated-webp',
              implementation: ImageMinimizerPlugin.sharpGenerate,
              options: {
                encodeOptions: {
                  webp: {
                    quality: 65,
                    effort: 6
                  }
                }
              }
            }
          ]
        })
      ]
    }
  };
};
