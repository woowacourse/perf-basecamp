import { memo } from 'react';

import { GifImageModel } from '../../../../models/image/gifImage';

import styles from './GifItem.module.css';

type GifItemProps = Omit<GifImageModel, 'id'>;

const GifItem = ({ imageUrl = '', title = '' }: GifItemProps) => {
  return (
    <div className={styles.gifItem}>
      <img className={styles.gifImage} src={imageUrl} alt={title} loading="lazy" />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

// 추가 로드 시 기존 목록이 다시 렌더되지 않도록 props가 같으면 렌더를 건너뛴다.
export default memo(GifItem);
