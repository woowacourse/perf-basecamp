const path = require('node:path');

const { globSync } = require('glob');
const sharp = require('sharp');
const fs = require('node:fs/promises');

const convertGifToMp4 = require('./convert-gif-to-mp4');

const inputDirectory = process.argv[2] ?? 'src/assets/images';
const staticImagePattern = path.posix.join(
  inputDirectory.replaceAll(path.sep, '/'),
  '**/*.{jpg,jpeg,png}'
);
const gifPattern = path.posix.join(
  inputDirectory.replaceAll(path.sep, '/'),
  '**/*.gif'
);

const staticImages = globSync(staticImagePattern, {
  nodir: true,
  nocase: true
});
const gifs = globSync(gifPattern, {
  nodir: true,
  nocase: true
});

async function convertImage(imagePath) {
  const { dir, name } = path.parse(imagePath);
  const webpPath = path.join(dir, `${name}.webp`);
  const avifPath = path.join(dir, `${name}.avif`);

  await Promise.all([
    sharp(imagePath).webp({ quality: 80 }).toFile(webpPath),
    sharp(imagePath).avif({ quality: 60 }).toFile(avifPath)
  ]);

  console.log(`Converted ${imagePath}`);
}

async function convertGif(gifPath) {
  const { dir, name } = path.parse(gifPath);
  const mp4Path = path.join(dir, `${name}.mp4`);
  const gifBuffer = await fs.readFile(gifPath);
  const mp4Buffer = await convertGifToMp4(gifBuffer);

  await fs.writeFile(mp4Path, mp4Buffer);
  console.log(`Converted ${gifPath}`);
}

async function main() {
  const conversions = [
    ...staticImages.map((imagePath) => () => convertImage(imagePath)),
    ...gifs.map((gifPath) => () => convertGif(gifPath))
  ];

  if (conversions.length === 0) {
    console.log(`No JPG, PNG, or GIF images found in ${inputDirectory}.`);
    return;
  }

  const results = await Promise.allSettled(
    conversions.map((convert) => convert())
  );
  const failures = results.filter((result) => result.status === 'rejected');

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(failure.reason);
    }

    throw new Error(
      `Failed to convert ${failures.length} of ${conversions.length} images.`
    );
  }

  console.log(
    `Converted ${staticImages.length} image(s) to WebP/AVIF and ${gifs.length} GIF(s) to MP4.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
