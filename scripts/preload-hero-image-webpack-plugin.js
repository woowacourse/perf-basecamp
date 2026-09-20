const HtmlWebpackPlugin = require('html-webpack-plugin');

const PLUGIN_NAME = 'PreloadHeroImageWebpackPlugin';
const RESPONSIVE_WIDTHS = [640, 1280, 1920];

class PreloadHeroImageWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
        PLUGIN_NAME,
        (data) => {
          const assetNames = compilation.getAssets().map(({ name }) => name);
          const heroImage = assetNames.find((name) =>
            /^static\/hero\.[^.]+\.png$/.test(name)
          );

          if (!heroImage) {
            compilation.errors.push(
              new Error(`${PLUGIN_NAME}: Could not find the emitted hero image.`)
            );
            return data;
          }

          const heroBasename = heroImage.replace(/\.png$/, '');
          const responsiveImages = RESPONSIVE_WIDTHS.map((width) => {
            const name = `${heroBasename}-${width}.avif`;

            if (!assetNames.includes(name)) {
              compilation.errors.push(
                new Error(`${PLUGIN_NAME}: Could not find ${name}.`)
              );
            }

            return name;
          });
          const preloadLink = [
            '<link rel="preload" fetchpriority="high" as="image" type="image/avif"',
            `href="./${responsiveImages[responsiveImages.length - 1]}"`,
            `imagesrcset="${responsiveImages
              .map((name, index) => `./${name} ${RESPONSIVE_WIDTHS[index]}w`)
              .join(', ')}"`,
            'imagesizes="100vw" />'
          ].join(' ');

          data.html = data.html.replace(
            '</head>',
            `  ${preloadLink}\n</head>`
          );

          return data;
        }
      );
    });
  }
}

module.exports = PreloadHeroImageWebpackPlugin;
