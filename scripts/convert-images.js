const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const RESIZE_STANDARDS = [400, 800, 1600];

const isConvertible = (fileName) => /\.(png|jpg|jpeg)$/i.test(fileName);

const parseOutputFileName = (fileName, extension, size) =>
  `${fileName.replace(/\.(png|jpg|jpeg|gif)$/i, '')}-${size}.${extension}`;

const saveImage = async (image, fileName, extension, size) => {
  const { name } = path.parse(fileName);
  const outputDirectory = path.join(__dirname, '../dist/static');
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }
  await fs.promises.writeFile(
    path.join(outputDirectory, parseOutputFileName(name, extension, size)),
    image
  );
};

const resizeImage = async (image, size) => {
  return await sharp(image).resize({ width: size }).toBuffer();
};

const safeOptimizeAVIFImage = async (originalImage, filePath) => {
  try {
    const avifImage = await sharp(originalImage).avif({ quality: 75 }).toBuffer();
    for (const size of RESIZE_STANDARDS) {
      const resizedImage = await resizeImage(avifImage, size);
      await saveImage(resizedImage, filePath, 'avif', size);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`AVIF 변환 실패 : ${filePath} ${error.message}`);
      return null;
    }
  }
};

const safeOptimizeWebpImage = async (originalImage, filePath) => {
  try {
    const webpImage = await sharp(originalImage).webp({ quality: 75 }).toBuffer();
    for (const size of RESIZE_STANDARDS) {
      const resizedImage = await resizeImage(webpImage, size);
      await saveImage(resizedImage, filePath, 'webp', size);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`WebP 변환 실패 : ${filePath} ${error.message}`);
      return null;
    }
  }
};

const tryConvertImage = async () => {
  const inputDirectory = path.join(__dirname, '../src/assets/images');
  const fileNames = await fs.promises.readdir(inputDirectory);

  for (const fileName of fileNames) {
    if (!isConvertible(fileName)) continue;
    console.log(`변환 시작 : ${fileName}`);
    const filePath = path.join(inputDirectory, fileName);

    const buffer = await fs.promises.readFile(filePath);
    await safeOptimizeAVIFImage(buffer, filePath);
    await safeOptimizeWebpImage(buffer, filePath);
  }
};

if (require.main === module) {
  (async () => {
    await tryConvertImage();
    console.log('✅ 이미지 변환 완료');
  })();
}
