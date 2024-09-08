import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
  srcSet: string;
};

const FeatureItem = ({ title, imageSrc, srcSet }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <picture>
        <source srcSet={srcSet} type="image/webp" />
        <img className={styles.featureImage} src={imageSrc} alt="" />
      </picture>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
