const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { gzipSync, brotliCompressSync } = require('node:zlib');
const webpack = require('webpack');
const makeConfig = require('../webpack.config.js');

const config = makeConfig({}, { mode: 'production' });
const compiler = webpack({ ...config, mode: 'production' });
compiler.run((error, stats) => {
  compiler.close(() => {});
  if (error || stats.hasErrors()) {
    console.error(error || stats.toString({ all: false, errors: true }));
    process.exitCode = 1;
    return;
  }
  try {
    const report = stats.toJson({ source: false });
    const read = (name) => fs.readFileSync(path.join(config.output.path, name));
    const initialScripts = report.entrypoints.main.assets.filter((a) => a.name.endsWith('.js'));
    const sizes = initialScripts.map((a) => ({
      file: a.name,
      raw: read(a.name).length,
      gzip: gzipSync(read(a.name)).length,
      brotli: brotliCompressSync(read(a.name)).length
    }));
    const gzipTotal = sizes.reduce((sum, item) => sum + item.gzip, 0);
    console.table(sizes);
    assert(gzipTotal < 60000, `Initial JS gzip budget exceeded: ${gzipTotal} bytes`);
    const heroes = report.assets.filter((a) => /\/hero(?:-mobile)?\.[a-f0-9]+\.webp$/.test(a.name));
    assert.equal(heroes.length, 2);
    heroes.forEach((a) => assert(a.size < 120000, `${a.name}: ${a.size} bytes`));
    const flatten = (modules) => (modules || []).flatMap((m) => [m, ...flatten(m.modules)]);
    const initialModules = report.chunks
      .filter((c) => c.initial)
      .flatMap((c) => flatten(c.modules));
    assert(
      !initialModules.some((m) => /src\/pages\/Search\/|src\/apis\//.test(m.name || '')),
      'Search/API code leaked into initial JS'
    );
    const allModules = report.chunks.flatMap((c) => flatten(c.modules));
    const icons = allModules.find((m) => /react-icons\/ai\/index.esm.js$/.test(m.name || ''));
    assert(icons, 'Expected the ESM react-icons module');
    assert.deepEqual([...icons.usedExports].sort(), [
      'AiOutlineClose',
      'AiOutlineInfo',
      'AiOutlineSearch'
    ]);
    console.log(
      `PASS: Home JS gzip ${gzipTotal} / 60000 bytes; both hero images < 120000 bytes; Search split; only 3 icons used.`
    );
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
});
