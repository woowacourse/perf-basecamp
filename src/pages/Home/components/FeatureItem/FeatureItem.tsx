import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrc: string;
};

const FeatureItem = ({ title, videoSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureVideo} src={videoSrc} autoPlay muted loop />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
