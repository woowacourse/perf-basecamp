import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  webmSrc: string;
};

const FeatureItem = ({ title, webmSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        <source src={webmSrc} />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
