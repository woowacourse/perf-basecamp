import React from "react";

import styles from "./FeatureItem.module.css";

const FeatureItem = ({ title, webmSrc, mp4Src }) => (
  <div className={styles.featureItem}>
    <video className={styles.featureImage} autoPlay loop muted playsInline>
      <source src={webmSrc} type="video/webm" />
      <source src={mp4Src} type="video/mp4" />
    </video>
    <div className={styles.featureTitleBg} />
    <h3 className={styles.featureTitle}>{title}</h3>
  </div>
);

export default FeatureItem;
