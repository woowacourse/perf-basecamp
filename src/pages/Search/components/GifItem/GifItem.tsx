import { GifImageModel } from '../../../../models/image/gifImage';
import { memo } from 'react';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'> & {
  loading?: 'eager' | 'lazy';
};

const GifItem = ({ imageUrl = '', title = '', loading = 'lazy' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <img className={styles.gifImage} src={imageUrl} loading={loading} />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
