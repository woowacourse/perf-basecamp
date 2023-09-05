import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  webpSrc: string;
  gifSrc: string;
};

const FeatureItem = ({ title, webpSrc, gifSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <picture>
        <source type="image/webp" srcSet={webpSrc} />
        <source type="image/gif" srcSet={gifSrc} />
        <img className={styles.featureImage} src={gifSrc} alt={title} />
      </picture>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
