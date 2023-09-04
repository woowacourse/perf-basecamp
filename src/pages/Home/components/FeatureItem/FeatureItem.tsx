import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
  videoSrc: string;
};

const FeatureItem = ({ title, imageSrc, videoSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} muted autoPlay loop playsInline poster={imageSrc}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      {/*<img className={styles.featureImage} src={imageSrc} />*/}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
