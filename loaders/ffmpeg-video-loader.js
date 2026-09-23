const { spawn } = require('child_process');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const sharp = require('sharp');

const runFfmpeg = args =>
  new Promise((resolve, reject) => {
    if (ffmpegPath === null) {
      reject(new Error('ffmpeg-static does not provide a binary for this platform.'));
      return;
    }

    const process = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';

    process.stderr.setEncoding('utf8');
    process.stderr.on('data', chunk => {
      stderr += chunk;
    });
    process.on('error', reject);
    process.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}:\n${stderr}`));
    });
  });

module.exports = function ffmpegVideoLoader(content) {
  this.cacheable();

  const callback = this.async();
  const query = new URLSearchParams(this.resourceQuery);
  const requestedWidth = Number.parseInt(query.get('w') ?? '', 10);

  if (query.get('as') !== 'mp4') {
    callback(new Error('The FFmpeg loader currently supports only as=mp4.'));
    return;
  }

  if (!Number.isFinite(requestedWidth) || requestedWidth <= 0) {
    callback(new Error('The FFmpeg loader requires a positive w query parameter.'));
    return;
  }

  const transform = async () => {
    let temporaryDirectory;

    try {
      const metadata = await sharp(content, { animated: true }).metadata();
      const outputWidth = Math.min(requestedWidth, metadata.width ?? requestedWidth);
      const outputName = `${path.parse(this.resourcePath).name}-${outputWidth}.mp4`;

      temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'webpack-ffmpeg-'));
      const inputPath = path.join(temporaryDirectory, path.basename(this.resourcePath));
      const outputPath = path.join(temporaryDirectory, outputName);
      const scale = `scale=w='min(${requestedWidth},iw)':h=-2:flags=lanczos,format=yuv420p`;

      await fs.writeFile(inputPath, content);
      await runFfmpeg([
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        '-i',
        inputPath,
        '-an',
        '-vf',
        scale,
        '-c:v',
        'libx264',
        '-preset',
        'medium',
        '-crf',
        '28',
        '-movflags',
        '+faststart',
        outputPath
      ]);

      const output = await fs.readFile(outputPath);
      const emittedPath = `static/${outputName}`;
      this.emitFile(emittedPath, output);

      return `export default __webpack_public_path__ + ${JSON.stringify(emittedPath)};`;
    } finally {
      if (temporaryDirectory !== undefined) {
        await fs.rm(temporaryDirectory, { recursive: true, force: true });
      }
    }
  };

  transform().then(result => callback(null, result), callback);
};

module.exports.raw = true;
