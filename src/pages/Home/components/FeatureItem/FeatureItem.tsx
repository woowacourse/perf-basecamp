import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrc: string;
  description?: string;
};

const FeatureItem = ({ title, videoSrc, description }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video
        className={styles.featureImage}
        src={videoSrc}
        autoPlay
        loop
        muted
        aria-label={description || `${title} 비디오`}
      />
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
