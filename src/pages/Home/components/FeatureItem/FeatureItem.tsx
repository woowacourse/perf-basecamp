import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  webmUrl: string;
  mp4Url: string;
};

const FeatureItem = ({ title, webmUrl, mp4Url }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        <source src={webmUrl} type="video/webm" />
        <source src={mp4Url} type="video/mp4" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
