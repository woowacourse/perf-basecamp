import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  videoSrc: string;
}

const FeatureItem = ({ title, videoSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video
        className={styles.featureImage}
        src={videoSrc}
        aria-label={title}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
