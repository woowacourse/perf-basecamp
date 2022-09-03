import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
  altImageSrc: string;
};

const FeatureItem = ({ title, imageSrc, altImageSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video autoPlay loop muted className={styles.featureImage}>
        <source type="video/webm" src={imageSrc} />
        <img src={altImageSrc} alt="video" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
