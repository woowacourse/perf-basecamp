import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  defaultVideoSrc: string;
  subVideoSrc: string;
};

const FeatureItem = ({ title, defaultVideoSrc, subVideoSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video autoPlay loop muted playsInline>
        <source src={defaultVideoSrc} type="video/webm" />
        <source src={subVideoSrc} type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
