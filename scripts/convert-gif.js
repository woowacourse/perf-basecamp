const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const isConvertible = (fileName) => /\.gif$/i.test(fileName);

const parseOutputFileName = (fileName, extension) =>
  `${fileName.replace(/\.(gif)$/i, '')}.${extension}`;

const createDirectory = (outputDirectory) => {
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }
};

const safeConvertToWebm = async (filePath) => {
  const fileBase = path.basename(filePath, '.gif');
  try {
    const outputDirectory = path.join(__dirname, '../dist/static');
    createDirectory(outputDirectory);
    execSync(
      `ffmpeg -i ${filePath} -c:v libvpx-vp9 -b:v 0 -crf 41 ${outputDirectory}/${parseOutputFileName(
        fileBase,
        'webm'
      )}`
    );
  } catch (error) {
    throw new Error(`GIF 변환 실패 : ${fileBase} ${error.message}`);
  }
};

const safeConvertToMp4 = async (filePath) => {
  const fileBase = path.basename(filePath, '.gif');
  try {
    const outputDirectory = path.join(__dirname, '../dist/static');
    createDirectory(outputDirectory);
    execSync(
      `ffmpeg -i ${filePath} -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 25 ${outputDirectory}/${parseOutputFileName(
        fileBase,
        'mp4'
      )}`
    );
  } catch (error) {
    throw new Error(`MP4 변환 실패 : ${fileBase} ${error.message}`);
  }
};

const deleteGif = async (filePath) => {
  const fileBase = path.basename(filePath, '.gif');
  try {
    await fs.promises.unlink(filePath);
    console.log(`✅ 원본 GIF 삭제 : ${fileBase}`);
  } catch (error) {
    throw new Error(`원본 GIF 삭제 실패 : ${fileBase} ${error.message}`);
  }
};

const tryConvertGif = async () => {
  const inputDirectory = path.join(__dirname, '../src/assets/images');
  const outputDirectory = path.join(__dirname, '../dist/static');
  const fileNames = await fs.promises.readdir(inputDirectory);

  for (const fileName of fileNames) {
    if (!isConvertible(fileName)) continue;
    console.log(`변환 시작 : ${fileName}`);

    const filePath = path.join(inputDirectory, fileName);
    const deletePath = path.join(outputDirectory, fileName);
    await safeConvertToWebm(filePath);
    await safeConvertToMp4(filePath);
    await deleteGif(deletePath);
  }
};

if (module.parent === null) {
  (async () => {
    await tryConvertGif();
    console.log('✅ GIF 변환 완료');
  })();
}
