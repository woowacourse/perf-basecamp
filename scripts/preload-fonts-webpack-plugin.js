const HtmlWebpackPlugin = require('html-webpack-plugin');

const PLUGIN_NAME = 'PreloadFontsWebpackPlugin';

const FONT_FACES = [
  {
    style: 'normal',
    assetPattern: /^static\/josefin-sans-normal\.[^.]+\.woff2$/
  },
  {
    style: 'italic',
    assetPattern: /^static\/josefin-sans-italic\.[^.]+\.woff2$/
  }
];

const UNICODE_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, ' +
  'U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, ' +
  'U+2212, U+2215, U+FEFF, U+FFFD';

class PreloadFontsWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
        PLUGIN_NAME,
        (data) => {
          const assetNames = compilation.getAssets().map(({ name }) => name);
          const resolved = FONT_FACES.map(({ style, assetPattern }) => {
            const name = assetNames.find((n) => assetPattern.test(n));

            if (!name) {
              compilation.errors.push(
                new Error(
                  `${PLUGIN_NAME}: Could not find emitted font asset for style "${style}".`
                )
              );
            }

            return { style, name };
          });

          if (resolved.some(({ name }) => name == null)) {
            return data;
          }

          const preloadLinks = resolved
            .map(
              ({ name }) =>
                `<link rel="preload" href="${name}" as="font" type="font/woff2" crossorigin />`
            )
            .join('\n  ');

          const fontFaceRules = resolved
            .map(
              ({ style, name }) =>
                `@font-face {
      font-family: 'Josefin Sans';
      font-style: ${style};
      font-weight: 400 700;
      font-display: swap;
      src: url('${name}') format('woff2');
      unicode-range: ${UNICODE_RANGE};
    }`
            )
            .join('\n    ');

          const injection = `  ${preloadLinks}
  <style>${fontFaceRules}</style>
`;

          data.html = data.html.replace('</head>', `${injection}</head>`);

          return data;
        }
      );
    });
  }
}

module.exports = PreloadFontsWebpackPlugin;
