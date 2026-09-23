const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const sharp = require('sharp');

const execFileAsync = promisify(execFile);

const resolveFfmpegPath = () => {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;

  try {
    return require('ffmpeg-static');
  } catch {
    return 'ffmpeg';
  }
};

const isAnimatedWebp = (content) => {
  let offset = 12;

  while (offset + 8 <= content.length) {
    const chunkType = content.toString('ascii', offset, offset + 4);
    const chunkSize = content.readUInt32LE(offset + 4);

    if (chunkType === 'ANIM') return true;
    offset += 8 + chunkSize + (chunkSize % 2);
  }

  return false;
};

const exportEmittedFile = (emittedPath) =>
  `export default __webpack_public_path__ + ${JSON.stringify(emittedPath)};`;

module.exports = function animatedImageToMp4Loader(content) {
  const extension = path.extname(this.resourcePath).toLowerCase();

  if (extension === '.webp' && !isAnimatedWebp(content)) {
    const emittedPath = `static/${path.basename(this.resourcePath)}`;
    this.emitFile(emittedPath, content);
    return exportEmittedFile(emittedPath);
  }

  const callback = this.async();
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 8);
  const fileName = `${path.basename(this.resourcePath, extension)}.${hash}.mp4`;
  const emittedPath = `static/${fileName}`;
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'animated-image-to-mp4-'));
  const temporaryOutput = path.join(temporaryDirectory, fileName);
  const ffmpegInput =
    extension === '.webp' ? path.join(temporaryDirectory, 'animation.gif') : this.resourcePath;

  this.cacheable(true);

  (async () => {
    try {
      if (extension === '.webp') {
        await sharp(this.resourcePath, { animated: true }).gif().toFile(ffmpegInput);
      }

      await execFileAsync(resolveFfmpegPath(), [
        '-y',
        '-i',
        ffmpegInput,
        '-an',
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-vf',
        'scale=trunc(iw/2)*2:trunc(ih/2)*2',
        '-movflags',
        '+faststart',
        temporaryOutput
      ]);

      this.emitFile(emittedPath, fs.readFileSync(temporaryOutput));
      fs.rmSync(temporaryDirectory, { recursive: true, force: true });
      callback(null, exportEmittedFile(emittedPath));
    } catch (error) {
      fs.rmSync(temporaryDirectory, { recursive: true, force: true });
      const details = error.stderr ?? error.message;
      callback(new Error(`Failed to convert ${this.resourcePath} to MP4:\n${details}`));
    }
  })();
};

module.exports.raw = true;
