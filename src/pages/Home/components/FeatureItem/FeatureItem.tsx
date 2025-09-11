import { getAssetSrc } from '../../../../utils/changeImageExtension';
import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  const webmSrc = getAssetSrc(imageSrc, 'webm');
  const mp4Src = getAssetSrc(imageSrc, 'mp4');

  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <div className={styles.featureItem}>
      {isProduction ? (
        <video className={styles.featureImage} autoPlay loop muted playsInline>
          <source src={webmSrc} type="video/webm" />
          <source src={mp4Src} type="video/mp4" />
        </video>
      ) : (
        <img className={styles.featureImage} src={imageSrc} alt={title} />
      )}

      <div className={styles.featureTitleBg} />
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
