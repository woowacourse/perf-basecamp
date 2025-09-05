import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  const isVideo = imageSrc.endsWith('.mp4');

  return (
    <div className={styles.featureItem}>
      {isVideo ? (
        <video className={styles.featureImage} src={imageSrc} autoPlay loop muted playsInline />
      ) : (
        <img className={styles.featureImage} src={imageSrc} alt={title} loading="lazy" />
      )}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
