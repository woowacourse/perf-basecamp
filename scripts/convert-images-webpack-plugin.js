const path = require('node:path');

const sharp = require('sharp');

const PLUGIN_NAME = 'ConvertImagesWebpackPlugin';
const SOURCE_IMAGE_PATTERN = /\.(?:jpe?g|png)$/i;

class ConvertImagesWebpackPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_DERIVED
        },
        async () => {
          const sourceImages = compilation
            .getAssets()
            .filter(({ name }) => SOURCE_IMAGE_PATTERN.test(name));

          await Promise.all(
            sourceImages.map(async ({ name, source }) => {
              const { dir, name: basename } = path.posix.parse(name);
              const imageBuffer = Buffer.from(source.source());

              const [webpBuffer, avifBuffer] = await Promise.all([
                sharp(imageBuffer).webp({ quality: 80 }).toBuffer(),
                sharp(imageBuffer).avif({ quality: 60 }).toBuffer()
              ]);

              compilation.emitAsset(
                path.posix.join(dir, `${basename}.webp`),
                new compiler.webpack.sources.RawSource(webpBuffer)
              );
              compilation.emitAsset(
                path.posix.join(dir, `${basename}.avif`),
                new compiler.webpack.sources.RawSource(avifBuffer)
              );
            })
          );
        }
      );
    });
  }
}

module.exports = ConvertImagesWebpackPlugin;
