import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({title, imageSrc}: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <img className={styles.featureImage} src={imageSrc} alt="사진"/>
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
