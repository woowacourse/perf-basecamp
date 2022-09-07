import React from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = React.memo(({ gifUrl = '', webpUrl = '', title = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <picture>
        <source type="image/webp" srcSet={webpUrl} />
        <source type="image/gif" srcSet={gifUrl} />
        <img className={styles.featureImage} src={gifUrl} alt="" loading="lazy" />
      </picture>
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
});

export default GifItem;
