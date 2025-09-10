import { memo } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';
import LazyImage from '../../../Home/components/LazyImage/LazyImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ imageUrl = '', title = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <LazyImage
        className={styles.gifImage}
        src={imageUrl}
        alt={title}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg} />
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
