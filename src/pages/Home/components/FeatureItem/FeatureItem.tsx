import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  itemInformation: {
    title: string;
    index: number;
  };
};

const FeatureItem = ({ itemInformation }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video
        className={`${styles.featureImage} show-on-scroll`}
        autoPlay
        loop
        muted
        data-index={itemInformation.index}
      >
        <source type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{itemInformation.title}</h3>
    </div>
  );
};

export default FeatureItem;
