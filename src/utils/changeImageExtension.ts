const SIZES = ['400', '800', '1600'];

export const getAssetSrc = (imageSrc: string, extension: string) => {
  return imageSrc.replace(/(png|jpg|jpeg|gif)$/i, extension);
};

export const getOptimizedAssetSrcSet = (imageSrc: string, extension: string) =>
  SIZES.map((size) =>
    imageSrc.replace(/\.(png|jpg|jpeg|gif)$/i, `-${size}.${extension} ${size}w`)
  ).join(', ');
