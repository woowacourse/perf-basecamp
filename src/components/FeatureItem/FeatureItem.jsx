import React from "react";

import styles from "./FeatureItem.module.css";

const FeatureItem = ({ title, imageSrc }) => (
  <div className={styles.featureItem}>
    <img className={styles.featureImage} src={imageSrc} alt={title} />
    <div className={styles.featureTitleBg} />
    <h4 className={styles.featureTitle}>{title}</h4>
  </div>
);

export default FeatureItem;
