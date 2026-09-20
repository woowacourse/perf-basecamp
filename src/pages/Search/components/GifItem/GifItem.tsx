import { memo } from 'react';

import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ sources, title = '' }: GifItemProps): JSX.Element => {
  const imageUrl = sources.webp ?? sources.gif;

  return (
    <div className={styles.gifItem}>
      {sources.mp4 !== undefined ? (
        <video
          className={styles.gifImage}
          src={sources.mp4}
          autoPlay
          loop
          muted
          playsInline
          aria-label={title}
        />
      ) : (
        <img
          className={styles.gifImage}
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
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
