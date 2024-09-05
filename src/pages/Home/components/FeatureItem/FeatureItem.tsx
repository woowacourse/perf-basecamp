import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
  imageSrcWebM: string;
};

const FeatureItem = ({ title, imageSrc, imageSrcWebM }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted preload="auto">
        <source src={imageSrc} type="video/mp4" />
        <source src={imageSrcWebM} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
