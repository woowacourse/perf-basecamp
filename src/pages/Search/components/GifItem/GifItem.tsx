import { memo, useState, useCallback } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'> & {
  isNew?: boolean;
};

const GifItem = memo(({ imageUrl = '', title = '', isNew = false }: GifItemProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div 
      className={`${styles.gifItem} ${isNew ? styles.newItem : ''} ${isLoaded ? styles.loaded : ''}`}
    >
      {!hasError && (
        <img 
          className={styles.gifImage}
          src={imageUrl}
          alt={title}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
});

export default GifItem;
