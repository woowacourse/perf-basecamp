import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay muted loop playsInline>
        <source type="video/mp4" src={imageSrc}></source>
      </video>
      <div className={styles.featureTitleBg}></div>
      <h1 className={styles.featureTitle}>{title}</h1>
    </div>
  );
};

export default FeatureItem;
