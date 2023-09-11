import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrcList: string[];
};

const FeatureItem = ({ title, videoSrcList }: FeatureItemProps) => {
  const [webm, mp4] = videoSrcList;

  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
