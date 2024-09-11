import { useEffect, useRef } from 'react';
import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  gifSrc: string;
  mp4Src?: string;
  webmSrc?: string;
};

const FeatureItem = ({ title, gifSrc, mp4Src, webmSrc }: FeatureItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('video/webm') && webmSrc) {
      video.src = webmSrc;
    } else if (video.canPlayType('video/mp4') && mp4Src) {
      video.src = mp4Src;
    } else {
      video.src = gifSrc;
    }
  }, [webmSrc, mp4Src, gifSrc]);

  return (
    <div className={styles.featureItem}>
      <video ref={videoRef} autoPlay loop muted playsInline>
        <source src={gifSrc} type="image/gif" />
      </video>
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
