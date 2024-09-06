const { merge } = require('webpack-merge');
const defaultConfig = require('./webpack.config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = () => {
  return merge(defaultConfig, {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    plugins: [new MiniCssExtractPlugin()],
    optimization: {
      minimize: true,
      minimizer: ['...', new CssMinimizerPlugin()],
      splitChunks: {
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
            name: 'react',
            chunks: 'all'
          },
          reactIcons: {
            test: /[\\/]node_modules[\\/](react-icons)[\\/]/,
            name: 'react-icons',
            chunks: 'all'
          }
        },
        chunks: 'all'
      }
    }
  });
};
