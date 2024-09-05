import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
  fallbackSrc: string;
};

const FeatureItem = ({ title, imageSrc, fallbackSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted>
        <source src={imageSrc} type="video/webm" />
        <source src={fallbackSrc} type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg} />
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
