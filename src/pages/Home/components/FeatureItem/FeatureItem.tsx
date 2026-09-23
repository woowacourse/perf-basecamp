import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc?: string;
  videoSrc?: string;
};

const FeatureItem = ({ title, imageSrc, videoSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      {videoSrc == null ? (
        <img className={styles.featureImage} src={imageSrc} alt="" loading="lazy" decoding="async" />
      ) : (
        <video className={styles.featureImage} autoPlay loop muted playsInline preload="none">
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
