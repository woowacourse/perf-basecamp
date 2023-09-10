const { merge } = require('webpack-merge');
const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },

  devtool: 'source-map',

  optimization: {
    minimize: false
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
});
