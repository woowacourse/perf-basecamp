import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
  defaultImageSrc: string;
};

const FeatureItem = ({ title, imageSrc, defaultImageSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video autoPlay loop muted playsInline>
        <source className={styles.featureImage} src={imageSrc} type="video/webm" />
        <source className={styles.featureImage} src={defaultImageSrc} type="video/gif" />
        <p>gif, webm을 지원하지 않습니다.</p>
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
