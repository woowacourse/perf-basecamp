import { useEffect, useRef } from 'react';
import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        video.src = imageSrc;
        video.load();

        void video.play().catch(() => {});

        observer.unobserve(video);
      },
      {
        // 화면에 나타나기 200px 전에 미리 요청
        rootMargin: '200px 0px',
        threshold: 0
      }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [imageSrc]);

  return (
    <div className={styles.featureItem}>
      <video ref={videoRef} muted loop playsInline preload="none" className={styles.featureImage} />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
