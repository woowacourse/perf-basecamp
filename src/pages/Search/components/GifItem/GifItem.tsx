import { memo } from 'react';
import { GifImageModel } from '../../../../types/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ imageUrl = '', title = '' }: GifItemProps): JSX.Element => {
  return (
    <div className={styles.gifItem}>
      <img
        className={styles.gifImage}
        src={imageUrl}
        alt={title}
        width="280"
        height="280"
        loading="lazy"
        decoding="async"
      />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
