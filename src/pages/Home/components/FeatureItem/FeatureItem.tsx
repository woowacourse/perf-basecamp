import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  const isWebM = imageSrc.endsWith('.webm');

  return (
    <div className={styles.featureItem}>
      {isWebM ? (
        <video className={styles.featureImage} autoPlay loop muted>
          <source src={imageSrc} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img className={styles.featureImage} src={imageSrc} alt={title} />
      )}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
