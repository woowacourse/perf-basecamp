import React from "react";

import styles from "./GifItem.module.css";

const GifItem = ({ videoURL = "", title = "" }) => {
  return (
    <div className={styles.gifItem}>
      <video className={styles.gifImage} autoPlay muted loop>
        <source src={videoURL} type="video/mp4" />
      </video>
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default React.memo(GifItem);
