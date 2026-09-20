interface ResponsiveImageProps {
  image: ResponsiveImageData;
  alt: string;
  fallback?: string;
  className?: string;
  sizes?: string;
}

const ResponsiveImage = ({
  image,
  alt,
  fallback,
  className,
  sizes = '100vw'
}: ResponsiveImageProps): JSX.Element => (
  <picture>
    <source srcSet={image.srcSet} sizes={sizes} type="image/webp" />
    <img
      className={className}
      src={fallback ?? image.src}
      width={image.width}
      height={image.height}
      alt={alt}
    />
  </picture>
);

export default ResponsiveImage;
