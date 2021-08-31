import React from 'react';
import styles from './FeatureItem.module.css';

const FeatureItem = ({ title, imageSrc }) => {
  return (
    <div className={styles.featureItem}>
      <video
        className={styles.featureImage}
        src={imageSrc}
        type='video/mp4'
        autoPlay
        muted
        loop
        playsInline
      />
      <img className={styles.featureImage} src={imageSrc} alt='featureImage' />
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
