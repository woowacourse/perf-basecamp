import React, { memo } from "react";

import styles from "./GifItem.module.css";

const GifItem = ({ title = "", mp4Url = "" }) => (
  <div className={styles.gifItem}>
    <video className={styles.gifImage} autoPlay loop muted playsInline>
      <source src={mp4Url} type="video/mp4" />
    </video>
    <div className={styles.gifTitleContainer}>
      <div className={styles.gifTitleBg} />
      <h4 className={styles.gifTitle}>{title}</h4>
    </div>
  </div>
);

export default memo(GifItem);
