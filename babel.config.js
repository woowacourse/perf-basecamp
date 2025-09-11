module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false, // tree-shaking을 위해 ES modules을 유지
    }],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ],
  env: {
    // 개발 모드에서는 모듈을 CommonJS로 변환하여 HMR 호환성 보장
    development: {
      presets: [
        ['@babel/preset-env', {
          modules: 'auto'
        }],
        '@babel/preset-react'
      ]
    }
  }
};