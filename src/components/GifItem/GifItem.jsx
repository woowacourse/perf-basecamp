import React from 'react';
import styles from './GifItem.module.css';

const GifItem = ({ imageUrl = '', title = '' }) => {
  return (
    <div className={styles.gifItem}>
      <video className={styles.gifImage} autoPlay loop muted>
        <source type="video/mp4" src={imageUrl} />
      </video>
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default React.memo(GifItem);
