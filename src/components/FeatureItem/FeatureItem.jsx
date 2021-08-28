import React from 'react';

import styles from './FeatureItem.module.css';

const FeatureItem = ({ title, imageSrc }) => {
  return (
    <div className={styles.featureItem}>
      <img className={styles.featureImage} src={imageSrc} alt={title} />
      <div className={styles.featureTitleBg}></div>
      <p className={styles.featureTitle}>{title}</p>
    </div>
  );
};

export default FeatureItem;
