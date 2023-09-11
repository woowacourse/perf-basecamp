const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/index.tsx',
    resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    output: {
      filename: 'bundle.[chunkhash].js',
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
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        generateStatsFile: true,
        statsFilename: 'bundle-report.json'
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
          use: [isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|webp|mp4|avif)$/i,
          loader: 'file-loader',
          options: {
            name: 'static/[name].[ext]'
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif|webp|mp4)$/i,
          loader: 'image-webpack-loader',
          enforce: 'pre'
        }
      ]
    },
    optimization: {
      splitChunks: { chunks: 'all' },
      minimizer: [`...`, new CssMinimizerPlugin()]
    }
  };
};
