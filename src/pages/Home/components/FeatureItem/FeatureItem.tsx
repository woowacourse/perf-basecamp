import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  mp4Src: string;
};

const FeatureItem = ({ title, mp4Src }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted>
        <source src={mp4Src} type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
