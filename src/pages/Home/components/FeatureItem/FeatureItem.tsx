import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrc: string;
};

const FeatureItem = ({ title, videoSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        <source src={videoSrc} type="video/mp4" />
        <h3 className={styles.featureTitle}>{title}</h3>
      </video>
    </div>
  );
};

export default FeatureItem;
