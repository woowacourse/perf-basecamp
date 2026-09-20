// Production preview with real HTTP compression and browser caching.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { gzipSync, brotliCompressSync } = require('node:zlib');

const root = path.resolve(process.argv[2] || 'dist');
const port = Number(process.argv[3] || 4173);
const publicPath = process.env.PUBLIC_PATH || '/lumen/';
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(publicPath)) throw new Error('Invalid PUBLIC_PATH');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};
const cache = new Map();
http
  .createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405).end();
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (publicPath !== '/' && pathname === publicPath.slice(0, -1)) {
      res.writeHead(302, { Location: publicPath }).end();
      return;
    }
    if (!pathname.startsWith(publicPath)) {
      res.writeHead(404).end('Not found');
      return;
    }
    pathname = '/' + pathname.slice(publicPath.length);
    if (['/', '/search', '/search/'].includes(pathname)) pathname = '/index.html';
    const file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404).end('Not found');
      return;
    }
    const compressible = /\.(js|css|html|svg|json)$/.test(file);
    const accepted = (req.headers['accept-encoding'] || '')
      .split(',')
      .map((part) => {
        const [name, quality = 'q=1'] = part.trim().split(';');
        return { name, quality: Number(quality.trim().replace('q=', '')) };
      })
      .filter((part) => part.quality > 0)
      .map((part) => part.name);
    const encoding =
      compressible && accepted.includes('br')
        ? 'br'
        : compressible && accepted.includes('gzip')
        ? 'gzip'
        : 'identity';
    const key = file + ':' + encoding;
    if (!cache.has(key)) {
      const raw = fs.readFileSync(file);
      const body =
        encoding === 'br' ? brotliCompressSync(raw) : encoding === 'gzip' ? gzipSync(raw) : raw;
      const etag = '"' + crypto.createHash('sha256').update(body).digest('hex') + '"';
      cache.set(key, { body, etag });
    }
    const { body, etag } = cache.get(key);
    const headers = {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': /\/static\/.*\.[a-f0-9]{8}\./.test(pathname)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
      ETag: etag,
      Vary: 'Accept-Encoding'
    };
    if (encoding !== 'identity') headers['Content-Encoding'] = encoding;
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers).end();
      return;
    }
    res.writeHead(200, { ...headers, 'Content-Length': body.length });
    res.end(req.method === 'HEAD' ? undefined : body);
  })
  .listen(port, '127.0.0.1', () =>
    console.log(`Production preview: http://127.0.0.1:${port}${publicPath}`)
  );
