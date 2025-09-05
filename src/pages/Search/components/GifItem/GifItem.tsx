import React from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = React.memo(({ imageUrl = '', title = '' }: GifItemProps) => {
  const isVideo = imageUrl.includes('.mp4');
  return (
    <div className={styles.gifItem}>
      {isVideo ? (
        <video className={styles.gifImage} preload="metadata" autoPlay loop muted playsInline>
          <source src={imageUrl} type="video/mp4" />
        </video>
      ) : (
        <img className={styles.gifImage} src={imageUrl} />
      )}
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
});

export default GifItem;
