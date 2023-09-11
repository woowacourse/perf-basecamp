import { memo } from 'react';

import styles from './GifItem.module.css';

const Skeleton = () => {
  return (
    <div className={styles.gifItem} aria-hidden>
      <div className={styles.gifImage} />
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>Loading...</h4>
      </div>
    </div>
  );
};

export default memo(Skeleton);
