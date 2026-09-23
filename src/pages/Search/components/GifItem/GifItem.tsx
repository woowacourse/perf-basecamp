import { memo, useEffect, useRef, useState } from 'react';
import { GifImageModel } from '../../../../types/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'> & {
  priority?: boolean;
};

const GifItem = ({
  imageUrl = '',
  title = '',
  priority = false
}: GifItemProps): JSX.Element => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const canLoad = priority || shouldLoad;

  useEffect(() => {
    if (priority || shouldLoad) return;

    const item = itemRef.current;
    if (item === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(item);
    return () => observer.disconnect();
  }, [priority, shouldLoad]);

  return (
    <div ref={itemRef} className={styles.gifItem}>
      <img
        className={styles.gifImage}
        src={canLoad ? imageUrl : undefined}
        alt={title}
        width="280"
        height="280"
        loading="eager"
        {...{ fetchpriority: priority ? 'high' : 'low' }}
        decoding="async"
      />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
