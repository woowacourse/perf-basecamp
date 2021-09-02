import React from "react";

import styles from "./FeatureItem.module.css";

const FeatureItem = ({ title, src }) => {
  return (
    <div className={styles.featureItem}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.featureImage}
        src={src}
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
