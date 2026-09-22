import { memo, useEffect, useRef, useState } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ imageUrl = '', title = '' }: GifItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoadImage(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoadImage(true);
        observer.disconnect();
      },
      { rootMargin: '200px' }
    );

    if (itemRef.current !== null) observer.observe(itemRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={itemRef} className={styles.gifItem}>
      <img
        className={styles.gifImage}
        src={shouldLoadImage ? imageUrl : undefined}
        loading="lazy"
      />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
