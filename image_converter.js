const imageminWebp = require('imagemin-webp');

(async () => {
  const imagemin = (await import('imagemin')).default;
  const files = await imagemin(['src/assets/images/*.{jpg,png}'], {
    destination: 'src/assets/images',
    plugins: [imageminWebp({ quality: 50 })],
  });
  console.log(files);
})();
