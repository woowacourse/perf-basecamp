import classNames from 'classnames';
import styles from './ResponsiveImage.module.css';
import { useEffect, useState } from 'react';

type ResponsiveImageProps = React.HTMLAttributes<HTMLImageElement> & {
  image: ResponsiveImageMeta;
  alt?: string;
  preload?: boolean;
  fetchPriority?: 'low' | 'high' | 'auto';
};

const ResponsiveImage = ({
  image,
  alt,
  preload,
  fetchPriority,
  ...imageProps
}: ResponsiveImageProps) => {
  const [loadedUrl, setLoadedUrl] = useState<string>(image.placeholder ?? image.src);
  useEffect(() => {
    if (preload) {
      const options: object = { priority: fetchPriority };
      fetch(image.src, options)
        .then((response) => response.blob())
        .then(() => setLoadedUrl(image.src));
    }
  }, []);

  return (
    <div className={styles.imageFrame}>
      <img
        {...imageProps}
        className={classNames(
          styles.image,
          { [styles.imageLoaded]: loadedUrl === image.src },
          imageProps.className
        )}
        src={loadedUrl}
        {...(fetchPriority ? { fetchpriority: fetchPriority } : {})}
      />
    </div>
  );
};

export default ResponsiveImage;
