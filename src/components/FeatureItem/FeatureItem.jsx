import React from "react";

import styles from "./FeatureItem.module.css";

const FeatureItem = ({ title, src }) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        <source src={src} type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
