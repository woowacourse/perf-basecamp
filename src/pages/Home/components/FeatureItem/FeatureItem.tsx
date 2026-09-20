import { useState } from 'react';

import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  sources: {
    video: string;
    webp: string;
    gif: string;
  };
}

const supportsVideo = (): boolean => {
  if (typeof document === 'undefined') return false;

  const video = document.createElement('video');

  return video.canPlayType('video/mp4') !== '';
};

const FeatureItem = ({ title, sources }: FeatureItemProps): JSX.Element => {
  const [shouldUseVideo, setShouldUseVideo] = useState(supportsVideo);

  return (
    <div className={styles.featureItem}>
      {shouldUseVideo ? (
        <video
          className={styles.featureMedia}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setShouldUseVideo(false)}
        >
          <source src={sources.video} type="video/mp4" />
        </video>
      ) : (
        <picture>
          <source srcSet={sources.webp} type="image/webp" />
          <img className={styles.featureMedia} src={sources.gif} alt={title} />
        </picture>
      )}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
