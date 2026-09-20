import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrc: string;
  width: number;
  height: number;
};

const FeatureItem = ({ title, videoSrc, width, height }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video
        className={styles.featureImage}
        src={videoSrc}
        width={width}
        height={height}
        autoPlay
        muted
        loop
        playsInline
        aria-label={title}
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
