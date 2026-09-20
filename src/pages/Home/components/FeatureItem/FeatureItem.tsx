import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  type: 'gif' | 'mp4';
  src: string;
}

const FeatureItem = ({ title, type, src }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      {type === 'gif' ? (
        <img className={styles.featureImage} src={src} alt={title} />
      ) : (
        <video className={styles.featureImage} autoPlay loop playsInline muted preload="metadata">
          <source src={src} type="video/mp4" />
        </video>
      )}
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
