const fs = require('fs');
const path = require('path');

function measurePerformance() {
  console.log('웹 성능 측정 결과');
  console.log('='.repeat(50));

  const distDir = 'dist';

  console.log('\n JavaScript 번들 크기:');
  const jsFiles = fs.readdirSync(distDir).filter((file) => file.endsWith('.js'));
  let totalJsSize = 0;

  jsFiles.forEach((file) => {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalJsSize += stats.size;
    console.log(`  ${file}: ${sizeKB} KB`);
  });

  console.log(`총 JavaScript 크기: ${(totalJsSize / 1024).toFixed(2)} KB`);

  console.log('\n Gzip 압축 파일 크기:');
  const gzFiles = fs.readdirSync(distDir).filter((file) => file.endsWith('.gz'));
  let totalGzSize = 0;

  gzFiles.forEach((file) => {
    const filePath = path.join(distDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalGzSize += stats.size;
    console.log(`  ${file}: ${sizeKB} KB`);
  });

  if (totalGzSize > 0) {
    const compressionRatio = (((totalJsSize - totalGzSize) / totalJsSize) * 100).toFixed(1);
    console.log(` 총 압축 크기: ${(totalGzSize / 1024).toFixed(2)} KB`);
    console.log(` 압축률: ${compressionRatio}%`);
  }

  console.log('\n 이미지 파일 크기:');
  const staticDir = path.join(distDir, 'static');
  let totalImageSize = 0;

  if (fs.existsSync(staticDir)) {
    const imageFiles = fs.readdirSync(staticDir);

    imageFiles.forEach((file) => {
      const filePath = path.join(staticDir, file);
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      totalImageSize += stats.size;
      console.log(`  ${file}: ${sizeMB} MB`);
    });

    console.log(` 총 이미지 크기: ${(totalImageSize / 1024 / 1024).toFixed(2)} MB`);
  }

  console.log('\n HTML 파일 크기:');
  const htmlFile = path.join(distDir, 'index.html');
  if (fs.existsSync(htmlFile)) {
    const stats = fs.statSync(htmlFile);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  index.html: ${sizeKB} KB`);
  }

  console.log('\n 전체 번들 크기 요약:');
  let totalSize = 0;

  function calculateSize(dir) {
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        calculateSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    });
  }

  calculateSize(distDir);
  console.log(` 전체 dist 폴더 크기: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);

  console.log('\n 성능 점수 (추정):');
  const jsScore =
    totalJsSize < 200 * 1024 ? 100 : Math.max(0, 100 - (totalJsSize - 200 * 1024) / 1024);
  const imageScore =
    totalImageSize < 500 * 1024
      ? 100
      : Math.max(0, 100 - (totalImageSize - 500 * 1024) / 1024 / 10);
  const overallScore = Math.round((jsScore + imageScore) / 2);

  console.log(`  JavaScript 최적화: ${Math.round(jsScore)}/100`);
  console.log(`  이미지 최적화: ${Math.round(imageScore)}/100`);
  console.log(`  전체 점수: ${overallScore}/100`);

  console.log('\n 개선 제안:');
  if (totalImageSize > 500 * 1024) {
    console.log(' 이미지 최적화가 가장 시급합니다!');
  }
  if (totalJsSize > 200 * 1024) {
    console.log('JavaScript 번들 크기 최적화');
  }
  if (overallScore >= 80) {
    console.log('좋은 성능입니다!');
  } else if (overallScore >= 60) {
    console.log('개선이 필요합니다.');
  } else {
    console.log('긴급한 최적화가 필요합니다!');
  }
}

measurePerformance();
