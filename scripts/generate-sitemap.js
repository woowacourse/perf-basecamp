const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

const hostname = 'https://d1fvjfu2vj7jij.cloudfront.net';
const buildDir = path.resolve(__dirname, '../dist');

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/search', changefreq: 'daily', priority: 0.9 }
];

async function generateSitemap() {
  if (!links.length) {
    console.error('URL 목록이 비었습니다.');
    process.exit(1);
  }

  const sitemapStream = new SitemapStream({ hostname });
  const writeStream = createWriteStream(path.join(buildDir, 'sitemap.xml'));

  sitemapStream.pipe(writeStream);

  links.forEach((link) => sitemapStream.write(link));

  sitemapStream.end();

  try {
    await streamToPromise(sitemapStream);
    console.log('sitemap.xml 생성 완료!');
  } catch (err) {
    console.error('sitemap 생성 중 오류:', err);
  }
}

generateSitemap();
