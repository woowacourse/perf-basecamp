import type { ImgHTMLAttributes, ReactElement } from 'react';

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  pictureClassName?: string;
}

const Img = ({ src, pictureClassName, alt, ...imageProps }: ImgProps): ReactElement => {
  const avifSrc = src.replace(/\.(?:png|jpe?g)(?=\?|#|$)/i, '.avif');
  const webpSrc = src.replace(/\.(?:png|jpe?g)(?=\?|#|$)/i, '.webp');

  return (
    <picture className={pictureClassName}>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...imageProps} />
    </picture>
  );
};

export default Img;
