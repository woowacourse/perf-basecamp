import { memo } from 'react';

import { GifImageModel } from '../../../../models/image/gifImage';
import Video from '../../../../components/Video/Video';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'> & {
  loadImmediately?: boolean;
};

const GifItem = ({ sources, title = '', loadImmediately = false }: GifItemProps): JSX.Element => {
  const imageUrl = sources.webp ?? sources.gif;

  return (
    <div className={styles.gifItem}>
      {sources.video !== undefined ? (
        <Video
          className={styles.gifImage}
          src={sources.video}
          poster={sources.poster}
          loading={loadImmediately ? 'eager' : 'lazy'}
          rootMargin="100px 0px"
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
