import React from "react";

import styles from "./FeatureItem.module.css";

const FeatureItem = ({ title, imageSrc }) => {
    return (
        <div className={styles.featureItem}>
            <img className={styles.featureImage} src={imageSrc} />
            <div className={styles.featureTitleBg}></div>
            <h4 className={styles.featureTitle}>{title}</h4>
        </div>
    );
}

export default FeatureItem;