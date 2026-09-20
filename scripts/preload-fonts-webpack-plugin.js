const HtmlWebpackPlugin = require('html-webpack-plugin');

const PLUGIN_NAME = 'PreloadFontsWebpackPlugin';
const FONT_STYLES = ['normal', 'italic'];

class PreloadFontsWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
        PLUGIN_NAME,
        (data) => {
          const assetNames = compilation.getAssets().map(({ name }) => name);
          const fontAssets = FONT_STYLES.map((style) =>
            assetNames.find((name) =>
              new RegExp(`^static/josefin-sans-${style}\\.[^.]+\\.woff2$`).test(name)
            )
          );

          if (fontAssets.some((name) => name == null)) {
            compilation.errors.push(
              new Error(`${PLUGIN_NAME}: Could not find all emitted font assets.`)
            );
            return data;
          }

          const preloadLinks = fontAssets
            .map(
              (name) =>
                `<link rel="preload" href="./${name}" as="font" type="font/woff2" crossorigin />`
            )
            .join('\n  ');

          data.html = data.html.replace('</head>', `  ${preloadLinks}\n</head>`);

          return data;
        }
      );
    });
  }
}

module.exports = PreloadFontsWebpackPlugin;
