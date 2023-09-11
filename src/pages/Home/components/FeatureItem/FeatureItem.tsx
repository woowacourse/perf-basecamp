import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: { gif: string; webp: string };
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <picture>
        <source className={styles.featureImage} srcSet={imageSrc.webp} type="image/webp" />
        <img className={styles.featureImage} src={imageSrc.gif} />
      </picture>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
