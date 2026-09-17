import type { ImgHTMLAttributes, ReactElement } from 'react';

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  pictureClassName?: string;
}

const DEFAULT_RESPONSIVE_WIDTHS = [640, 1280, 1920] as const;

const createSrcSet = (
  src: string,
  extension: 'avif' | 'webp',
  widths: readonly number[]
): string => {
  return widths
    .map((width) => {
      const resizedSrc = src.replace(/\.(?:png|jpe?g)(?=\?|#|$)/i, `-${width}.${extension}`);

      return `${resizedSrc} ${width}w`;
    })
    .join(', ');
};

const Img = ({
  src,
  pictureClassName,
  sizes = '100vw',
  alt,
  ...imageProps
}: ImgProps): ReactElement => {
  const avifSrcSet = createSrcSet(src, 'avif', DEFAULT_RESPONSIVE_WIDTHS);
  const webpSrcSet = createSrcSet(src, 'webp', DEFAULT_RESPONSIVE_WIDTHS);

  return (
    <picture className={pictureClassName}>
      <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />
      <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
      <img src={src} alt={alt} {...imageProps} />
    </picture>
  );
};

export default Img;
