import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
  alt: string;
};

const FeatureItem = ({ title, imageSrc, alt }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video autoPlay loop playsInline muted className={styles.featureImage}>
        <source src={imageSrc} type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
