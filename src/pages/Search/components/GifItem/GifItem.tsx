import { memo } from 'react';

import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

// load more로 목록이 늘어날 때 기존 항목까지 전부 리렌더되던 것을 막는다.
// imageUrl과 title은 원시값이므로 얕은 비교로 충분하다.
const GifItem = ({ imageUrl = '', title = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <img
        className={styles.gifImage}
        src={imageUrl}
        alt={title}
        width={280}
        height={280}
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
