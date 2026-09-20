import { useEffect, useRef } from 'react';

import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrc: string;
};

const FeatureItem = ({ title, videoSrc }: FeatureItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video === null) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play();
          return;
        }

        video.pause();
      },
      { rootMargin: '200px' }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.featureItem}>
      <video
        ref={videoRef}
        className={styles.featureVideo}
        src={videoSrc}
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
