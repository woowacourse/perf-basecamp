import React from "react";

import styles from "./FeatureItem.module.css";

const FeatureItem = ({ title, videoSrc }) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay muted loop>
        <source src={videoSrc} type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
}

export default FeatureItem;