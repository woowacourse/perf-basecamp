import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';
import React from 'react';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = React.memo(({ imageUrl = '', title = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <img className={styles.gifImage} src={imageUrl} />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
});

GifItem.displayName = 'GifItem';

export default GifItem;
