const path = require('node:path');

const { globSync } = require('glob');
const sharp = require('sharp');

const inputDirectory = process.argv[2] ?? 'src/assets/images';
const imagePattern = path.posix.join(
  inputDirectory.replaceAll(path.sep, '/'),
  '**/*.{jpg,jpeg,png}'
);

const images = globSync(imagePattern, {
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

async function main() {
  if (images.length === 0) {
    console.log(`No JPG or PNG images found in ${inputDirectory}.`);
    return;
  }

  const results = await Promise.allSettled(images.map(convertImage));
  const failures = results.filter((result) => result.status === 'rejected');

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(failure.reason);
    }

    throw new Error(`Failed to convert ${failures.length} of ${images.length} images.`);
  }

  console.log(`Converted ${images.length} image(s) to WebP and AVIF.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
