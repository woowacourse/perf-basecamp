const sharp = require('sharp');

module.exports = function (content) {
  const callback = this.async();

  sharp(content, { animated: true })
    .webp({ quality: 80 })
    .toBuffer()
    .then((data) => {
      callback(null, data);
    })
    .catch((error) => {
      callback(error);
    });
};

module.exports.raw = true;
