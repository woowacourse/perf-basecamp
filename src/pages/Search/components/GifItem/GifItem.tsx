import { memo } from 'react';

import { GifImageModel } from '../../../../models/image/gifImage';
import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ imageUrl = '', title = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <img className={styles.gifImage} src={imageUrl} />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <p className={styles.gifTitle}>{title}</p>
      </div>
    </div>
  );
};

export default memo(GifItem);
