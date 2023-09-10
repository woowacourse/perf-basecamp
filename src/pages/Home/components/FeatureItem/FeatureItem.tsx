import { PropsWithChildren } from 'react';
import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
};

const FeatureItem = ({ title, children }: PropsWithChildren<FeatureItemProps>) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        {children}
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
