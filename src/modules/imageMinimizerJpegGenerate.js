const sharp = require('sharp');

module.exports =
  ({ quality = 65, resize = { width: 1280, height: 0 } }) =>
  async (origin) => {
    const { width, height } = resize;
    let imageBuffer;

    try {
      imageBuffer = await sharp(origin.data)
        .resize({ width, height: height > 0 ? height : undefined })
        .jpeg({ mozjpeg: true, quality })
        .toBuffer();
    } catch (error) {
      return {
        filename: origin.filename,
        data: origin.data,
        errors: [error],
        warnings: []
      };
    }

    const filename = origin.filename.split('.')[0];

    return {
      filename: `${filename}.jpg`,
      data: imageBuffer,
      warnings: [],
      errors: []
    };
  };
