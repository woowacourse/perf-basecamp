import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  mp4Src?: string;
  webmSrc: string;
};

const FeatureItem = ({ title, webmSrc, mp4Src }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        {webmSrc && <source src={webmSrc} type="video/mp4" />}
        {!webmSrc && mp4Src && <source src={mp4Src} type="video/mp4" />}
        <h4 className={styles.featureTitle}>{title}</h4>
      </video>
    </div>
  );
};

export default FeatureItem;
