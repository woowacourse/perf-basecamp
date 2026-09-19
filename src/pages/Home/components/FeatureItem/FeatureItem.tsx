import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  videoSrc: string;
}

const FeatureItem = ({ title, videoSrc }: FeatureItemProps): JSX.Element => {
  return (
    <div className={styles.featureItem}>
      <video
        className={styles.featureImage}
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        aria-label={title}
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
