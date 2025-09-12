import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc?: string;
  videoSrc?: string;
};

const FeatureItem = ({ title, imageSrc, videoSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      {videoSrc ? (
        <video className={styles.featureVideo} src={videoSrc} autoPlay loop muted playsInline />
      ) : (
        <img className={styles.featureImage} src={imageSrc} alt={title} />
      )}
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
