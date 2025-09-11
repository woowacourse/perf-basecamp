import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  mp4: string;
};

const FeatureItem = ({ title, mp4 }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        <h4 className={styles.featureTitle}>{title}</h4>
        <source src={mp4} type="video/mp4" />
      </video>
    </div>
  );
};

export default FeatureItem;
