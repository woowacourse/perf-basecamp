import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  imageSrc: string;
}

const FeatureItem = ({ title, imageSrc }: FeatureItemProps): JSX.Element => {
  return (
    <div className={styles.featureItem}>
      <img className={styles.featureImage} src={imageSrc} />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
