import { memo } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ videoUrl = '', title = '', url = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <a href={url}>
        <video className={styles.gifImage} src={videoUrl} autoPlay muted loop playsInline />
        <div className={styles.gifTitleContainer}>
          <div className={styles.gifTitleBg}></div>
          <h4 className={styles.gifTitle}>{title}</h4>
        </div>
      </a>
    </div>
  );
};

export default GifItem;

export const MemoizedGifItem = memo(GifItem);
