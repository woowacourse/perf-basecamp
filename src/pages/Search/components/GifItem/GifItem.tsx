import { memo } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = memo(({ title = '', webpUrl = '', url }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <a className={styles.gifLink} href={url} target="_blank">
        <img className={styles.gifImage} src={webpUrl} loading="lazy" />
      </a>
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
});

export default GifItem;
