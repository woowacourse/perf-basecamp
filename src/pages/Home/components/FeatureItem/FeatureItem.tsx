import { memo } from 'react';
import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  webmSrc: string | undefined;
  mp4Src?: string;
};

const FeatureItem = ({ title, webmSrc, mp4Src }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {!webmSrc && mp4Src && <source src={mp4Src} type="video/mp4" />}
        <h4 className={styles.featureTitle}>{title}</h4>
      </video>
    </div>
  );
};

export default memo(FeatureItem);
