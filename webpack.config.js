const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/dist'),
    assetModuleFilename: 'static/[name][ext]',
    clean: true,
  },
  devServer: {
    hot: true,
    open: true,
    openPage: 'perf-basecamp',
    historyApiFallback: true
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './public', to: './public' },
        { from: './lighthouse', to: './lighthouse' },
      ],
    }),
    new Dotenv()
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
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|mp4)$/i,
        type: 'asset/resource',
      }
    ]
  },
  optimization: {
    minimizer: [
      '...',
      new ImageMinimizerPlugin({
        generator: [
          {
            preset: "webp",
            implementation: ImageMinimizerPlugin.sharpGenerate,
            options: {
              resize: {
                height: 700,
              },
              encodeOptions: {
                webp: {
                  quality: 85,
                },
              },
            },
          },
        ],
      }),
    ],
  }
};
