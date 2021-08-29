import React from 'react';

import styles from './GifItem.module.css';

const GifItem = React.memo(({ url = '', title = '' }) => {
  return (
    <div className={styles.gifItem}>
      <video title={title} className={styles.gifImage} autoPlay loop>
        <source src={url} type="video/mp4" />
      </video>
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
});

export default GifItem;
