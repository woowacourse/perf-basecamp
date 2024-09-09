import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  return (
    <video autoPlay loop muted playsInline className={styles.featureItem} preload="none">
      <source className={styles.featureImage} src={imageSrc} type="video/mp4" />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </video>
  );
};

export default FeatureItem;
