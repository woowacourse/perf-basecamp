import { memo } from 'react';

import { GifImageModel } from '../../../../models/image/gifImage';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'> & {
  loadImmediately?: boolean;
};

const GifItem = ({ sources, title = '', loadImmediately = false }: GifItemProps): JSX.Element => {
  const { ref: containerRef, isIntersecting } =
    useIntersectionObserver<HTMLDivElement>('100px 0px');
  const shouldLoadVideo = loadImmediately || isIntersecting;
  const imageUrl = sources.webp ?? sources.gif;

  return (
    <div ref={containerRef} className={styles.gifItem}>
      {sources.mp4 !== undefined ? (
        <video
          className={styles.gifImage}
          src={shouldLoadVideo ? sources.mp4 : undefined}
          poster={shouldLoadVideo ? sources.poster : undefined}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          className={styles.gifImage}
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          width="280"
          height="280"
        />
      )}
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
