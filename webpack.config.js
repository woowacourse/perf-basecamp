const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

module.exports = (_, config) => {
  if (config.mode === 'production') {
    return merge(common, prodConfig);
  }

  return merge(common, devConfig);
};
