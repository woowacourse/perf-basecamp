import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
  videoSources?: {
    webm?: string;
    mp4?: string;
  };
};

const FeatureItem = ({ title, imageSrc, videoSources }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      {videoSources ? (
        <video
          className={styles.featureVideo}
          poster={imageSrc}
          width={480}
          height={416}
          autoPlay
          loop
          muted
          playsInline
        >
          {videoSources.webm ? <source src={videoSources.webm} type="video/webm" /> : null}
          {videoSources.mp4 ? <source src={videoSources.mp4} type="video/mp4" /> : null}
        </video>
      ) : (
        <img
          className={styles.featureImage}
          src={imageSrc}
          width={480}
          height={416}
          loading="lazy"
          alt={title}
        />
      )}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
