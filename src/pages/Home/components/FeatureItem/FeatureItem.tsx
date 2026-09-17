import { useEffect, useRef } from 'react';

import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrc: string;
};

const LAZY_LOAD_ROOT_MARGIN = '200px'; // 화면에 들어오기 조금 전에 미리 로드 시작

const FeatureItem = ({ title, videoSrc }: FeatureItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video === null) {
      return;
    }

    // 뷰포트 근처에 올 때 src를 지정해 지연 로딩하고, 벗어나면 재생을 멈춰 디코딩 비용을 줄임
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.src === '') {
            video.src = videoSrc;
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: LAZY_LOAD_ROOT_MARGIN }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoSrc]);

  return (
    <div className={styles.featureItem}>
      <video ref={videoRef} className={styles.featureImage} muted loop playsInline preload="none" />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
