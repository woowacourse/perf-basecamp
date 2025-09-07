const fs = require('fs');
const path = require('path');
function analyzeImages() {
  console.log('이미지 분석을 시작');

  const imagesDir = 'src/assets/images';
  const files = ['hero.png', 'find.gif', 'free.gif', 'trending.gif'];

  let totalSize = 0;

  console.log('\n현재 이미지 파일 크기:');

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    console.log('path.join(imagesDir, file);', path.join(imagesDir, file));
    console.log('fs.existsSync(filePath)', fs.existsSync(filePath));
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      console.log('fs.statSync(filePath)', fs.statSync(filePath));
      totalSize += size;
      console.log(`  ${file}: ${(size / 1024 / 1024).toFixed(2)} MB`);
    }
  }

  console.log(`\n총 이미지 크기: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

analyzeImages();
