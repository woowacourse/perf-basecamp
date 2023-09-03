import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  mp4Src: string;
};

const FeatureItem = ({ title, mp4Src }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} loop muted autoPlay>
        <source type="video/mp4" src={mp4Src} />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
