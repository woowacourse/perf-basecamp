import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <div className={styles.featureImageBox}>
        <img
          className={styles.featureImage}
          src={imageSrc}
          alt={`${title} feature illustration`}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
