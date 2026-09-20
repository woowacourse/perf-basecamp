import { memo, useEffect, useRef, useState } from 'react';

import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const PRELOAD_MARGIN = '200px';

const GifItem = ({ videoUrl = '', title = '' }: GifItemProps): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video === null) return () => undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.gifItem}>
      <video
        ref={videoRef}
        className={styles.gifImage}
        src={isNearViewport ? videoUrl : undefined}
        aria-label={title}
        preload="none"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
