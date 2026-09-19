// .performance/extract-webpack-stats.js

const fs = require('fs');
const path = require('path');

const name = process.argv[2];

if (!name) {
  console.error('측정 이름을 입력해주세요.');
  console.error('예: node .performance/extract-webpack-stats.js before-code-splitting');
  process.exit(1);
}

const statsPath = path.resolve(`.performance/stats/${name}.json`);

const summaryPath = path.resolve('.performance/webpack-summary.json');

const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

const jsAssets = (stats.assets ?? [])
  .filter((asset) => asset.name.endsWith('.js'))
  .map((asset) => ({
    name: asset.name,
    size: asset.size
  }));

const initialAssetNames = new Set(
  (stats.entrypoints?.main?.assets ?? []).map((asset) =>
    typeof asset === 'string' ? asset : asset.name
  )
);

const initialAssets = jsAssets.filter((asset) => initialAssetNames.has(asset.name));

const asyncAssets = jsAssets.filter((asset) => !initialAssetNames.has(asset.name));

const sumSize = (assets) => assets.reduce((total, asset) => total + asset.size, 0);

const result = {
  name,

  js: {
    totalSize: sumSize(jsAssets),
    assetCount: jsAssets.length,
    assets: jsAssets
  },

  initial: {
    size: sumSize(initialAssets),
    assets: initialAssets
  },

  async: {
    size: sumSize(asyncAssets),
    assets: asyncAssets
  }
};

let summary = [];

if (fs.existsSync(summaryPath)) {
  summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
}

// 같은 이름으로 다시 측정하면 기존 결과를 교체
const existingIndex = summary.findIndex((item) => item.name === name);

if (existingIndex >= 0) {
  summary[existingIndex] = result;
} else {
  summary.push(result);
}

fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

console.log(`Webpack stats extracted: ${name}`);
console.log(`Total JS: ${sumSize(jsAssets)} bytes`);
console.log(`Initial JS: ${sumSize(initialAssets)} bytes`);
console.log(`Async JS: ${sumSize(asyncAssets)} bytes`);
console.log(`JS assets: ${jsAssets.length}`);
