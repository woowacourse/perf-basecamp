import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoWebmSrc: string;
  videoMp4Src: string;
};

const FeatureItem = ({ title, videoWebmSrc, videoMp4Src }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        <source src={videoWebmSrc} type="video/webm" />
        <source src={videoMp4Src} type="video/webm" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
