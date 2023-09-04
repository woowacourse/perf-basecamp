import styles from './FeatureItem.module.css';

import trendingWebm from '../../../../assets/video/trending/trending.webm';
import trendingVideo from '../../../../assets/video/trending/trending.mp4';
import freeWebm from '../../../../assets/video/free/free.webm';
import freeVideo from '../../../../assets/video/free/free.mp4';
import findWebm from '../../../../assets/video/find/find.webm';
import findVideo from '../../../../assets/video/find/find.mp4';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const videoSrc: Record<string, Record<string, string>> = {
  trending: {
    webm: trendingWebm,
    mp4: trendingVideo
  },
  find: {
    webm: findWebm,
    mp4: findVideo
  },
  free: {
    webm: freeWebm,
    mp4: freeVideo
  }
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  return (
    <div className={styles.featureItem}>
      <video className={styles.featureImage} autoPlay loop muted playsInline>
        <source src={videoSrc[imageSrc].webm} type="video/webm" />
        <source src={videoSrc[imageSrc].mp4} type="video/mp4" />
      </video>

      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
