const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');

const ffmpegPath = require('ffmpeg-static');

const execFileAsync = promisify(execFile);

async function convertGifToMp4(gifBuffer) {
  if (ffmpegPath === null) {
    throw new Error('ffmpeg-static does not support this platform.');
  }

  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), 'gif-to-mp4-')
  );
  const gifPath = path.join(temporaryDirectory, 'input.gif');
  const mp4Path = path.join(temporaryDirectory, 'output.mp4');

  try {
    await fs.writeFile(gifPath, gifBuffer);
    await execFileAsync(
      ffmpegPath,
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-i',
        gifPath,
        '-an',
        '-movflags',
        '+faststart',
        '-pix_fmt',
        'yuv420p',
        '-vf',
        'scale=trunc(iw/2)*2:trunc(ih/2)*2',
        '-y',
        mp4Path
      ],
      { maxBuffer: 10 * 1024 * 1024 }
    );

    return await fs.readFile(mp4Path);
  } finally {
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  }
}

module.exports = convertGifToMp4;
