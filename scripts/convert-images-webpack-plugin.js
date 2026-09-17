const path = require('node:path');

const sharp = require('sharp');

const PLUGIN_NAME = 'ConvertImagesWebpackPlugin';
const SOURCE_IMAGE_PATTERN = /\.(?:jpe?g|png)$/i;
const RESPONSIVE_WIDTHS = [640, 1280, 1920];

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

              await Promise.all(
                RESPONSIVE_WIDTHS.flatMap((width) => [
                  sharp(imageBuffer)
                    .resize({ width })
                    .webp({ quality: 80 })
                    .toBuffer()
                    .then((buffer) => {
                      compilation.emitAsset(
                        path.posix.join(dir, `${basename}-${width}.webp`),
                        new compiler.webpack.sources.RawSource(buffer)
                      );
                    }),
                  sharp(imageBuffer)
                    .resize({ width })
                    .avif({ quality: 60 })
                    .toBuffer()
                    .then((buffer) => {
                      compilation.emitAsset(
                        path.posix.join(dir, `${basename}-${width}.avif`),
                        new compiler.webpack.sources.RawSource(buffer)
                      );
                    })
                ])
              );
            })
          );
        }
      );
    });
  }
}

module.exports = ConvertImagesWebpackPlugin;
