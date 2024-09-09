import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  gifSrc: string;
  mp4Src?: string;
  webmSrc?: string;
};

const FeatureItem = ({ title, gifSrc, mp4Src, webmSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <picture>
        {webmSrc && <source srcSet={webmSrc} type="image/webm" />}
        {mp4Src && <source srcSet={mp4Src} type="image/mp4" />}
        <source srcSet={gifSrc} type="image/gif" />
        <img className={styles.featureImage} src={gifSrc} />
      </picture>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
