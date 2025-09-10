const fs = require('fs');
const path = require('path');

const robotsContent = `
User-agent: *
Disallow: /admin/

Sitemap: https://d1fvjfu2vj7jij.cloudfront.net/sitemap.xml
`.trim();

const buildDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(buildDir)) {
  console.error('Build 폴더가 존재하지 않습니다. 먼저 빌드하세요.');
  process.exit(1);
}

fs.writeFileSync(path.join(buildDir, 'robots.txt'), robotsContent);

console.log('robots.txt 파일이 생성되었습니다.');
