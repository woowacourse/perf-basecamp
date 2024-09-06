const { merge } = require('webpack-merge');
const defaultConfig = require('./webpack.config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
      minimizer: ['...', new TerserPlugin(), new CssMinimizerPlugin()]
    }
  });
};
