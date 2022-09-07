import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  name: string;
};

const FeatureItem = ({ title, name }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video autoPlay loop muted className={styles.featureImage}>
        <source src={`/public/assets/videos/${name}.webm`} type="video/webm" />
        <source src={`/public/assets/videos/${name}.mp4`} type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
