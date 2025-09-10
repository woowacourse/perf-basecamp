const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    return prodConfig;
  }
  return devConfig;
};
