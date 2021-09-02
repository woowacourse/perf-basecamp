import React from 'react';
import styles from './FeatureItem.module.css';

const FeatureItem = ({ title, imageSrc }) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted>
        <source type="video/mp4" src={imageSrc} />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
