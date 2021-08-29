import React from 'react';

import styles from './FeatureItem.module.css';

const FeatureItem = ({ title, url }) => {
  return (
    <div className={styles.featureItem}>
      <video title={title} className={styles.featureImage} autoPlay loop>
        <source src={url} type="video/webm" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
