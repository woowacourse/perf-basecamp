import React from "react";

import styles from "./GifItem.module.css";

const GifItem = ({ imageUrl = "", title = "" }) => (
  <div className={styles.gifItem}>
    <img className={styles.gifImage} src={imageUrl} alt={title || "gifitem"} />
    <div className={styles.gifTitleContainer}>
      <div className={styles.gifTitleBg} />
      <h4 className={styles.gifTitle}>{title}</h4>
    </div>
  </div>
);

export default GifItem;
