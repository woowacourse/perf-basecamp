const { merge } = require('webpack-merge');
const defaultConfig = require('./webpack.config');

module.exports = () => {
  return merge(defaultConfig, {
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  });
};
