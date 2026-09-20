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
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
