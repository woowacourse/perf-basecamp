import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  index: number;
};

const FeatureItem = ({ title, index }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video
        className={`${styles.featureImage} show-on-scroll`}
        autoPlay
        loop
        muted
        tabIndex={index}
      >
        <source type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
