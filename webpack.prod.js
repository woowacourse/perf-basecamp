const { merge } = require('webpack-merge');
const common = require('./webpack.config');

module.exports = merge(common, {
  mode: 'production',
  // 기본값이지만 학습을 위해 추가함.
  optimization: {
    minimize: true
  }
});
