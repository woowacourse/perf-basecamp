import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrcGif: string;
  imageSrcWebp: string;
};

const FeatureItem = ({ title, imageSrcGif, imageSrcWebp }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <picture>
        <source type="image/webp" srcSet={imageSrcWebp} />
        <source type="image/gif" srcSet={imageSrcGif} />
        <img className={styles.featureImage} src={imageSrcGif} alt="" loading="lazy" />
      </picture>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
