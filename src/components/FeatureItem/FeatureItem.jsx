import React from 'react';

import styles from './FeatureItem.module.css';

const FeatureItem = ({ title, imageSrc }) => {
  return (
    <div className={styles.featureItem}>
      <img className={styles.featureImage} src={imageSrc} alt="feature-title" />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
