import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  webpSrc: string;
  fallbackSrc: string;
};

const FeatureItem = ({ title, webpSrc, fallbackSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img className={styles.featureImage} src={fallbackSrc} alt={title} loading="lazy" />
      </picture>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
