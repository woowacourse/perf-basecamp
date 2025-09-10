import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSources: string;
};

const FeatureItem = ({ title, videoSources }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      {videoSources && (
        <video
          className={styles.featureVideo}
          poster={videoSources}
          width={480}
          height={416}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSources} type="video/mp4" />;
        </video>
      )}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
