import { memo } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ videoUrl = '', title = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <video className={styles.gifImage} src={videoUrl} autoPlay loop muted playsInline />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
