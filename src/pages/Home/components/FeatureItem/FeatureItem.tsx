import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  videoSrc: string;
}

const FeatureItem = ({ title, videoSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureVideo} autoPlay muted loop>
        <source src={videoSrc} type="video/mp4" />
        현재 브라우저에서는 video 태그가 지원되지 않습니다. 😢
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
