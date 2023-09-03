import { memo } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ gifUrl = '', title = '', webpUrl = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <picture>
        <source srcSet={webpUrl} type="image/webp" />
        <source srcSet={gifUrl} type="image/gif" />
        <img className={styles.gifImage} src={gifUrl} loading="lazy" alt={title} />
      </picture>
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
