const imageminWebp = require('imagemin-webp');

(async () => {
  const imagemin = (await import('imagemin')).default;
  const files = await imagemin(['src/assets/images/hero.jpg'], {
    destination: 'src/assets/images',
    plugins: [imageminWebp({ quality: 50 })],
  });
  console.log(files);
})();
