import styles from './FeatureItem.module.css';

type Video = {
  format: 'mp4' | 'webm';
  src: string;
};

type FeatureItemProps = {
  title: string;
  videoList: Video[];
};

const FeatureItem = ({ title, videoList }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted>
        {videoList.map(({ format, src }) => (
          <source key={src} src={src} type={`video/${format}`} />
        ))}
      </video>
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
