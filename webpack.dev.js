const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    hot: true,
    open: true,
    port: 8080,
    historyApiFallback: true
  },
  optimization: {
    minimize: false
  }
});
