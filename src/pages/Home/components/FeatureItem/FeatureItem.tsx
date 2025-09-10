import { memo } from 'react';
import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = memo(({ title, imageSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <img className={styles.featureImage} src={imageSrc} />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
});

FeatureItem.displayName = 'FeatureItem';

export default FeatureItem;
