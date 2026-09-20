import { useEffect, useRef } from 'react';
import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  imageSrc: string;
  videoSrc: string;
}

const FeatureItem = ({ title, imageSrc, videoSrc }: FeatureItemProps): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video === null) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = false;
    const updatePlayback = (): void => {
      if (!isVisible || document.hidden || reducedMotion.matches) {
        video.pause();
        return;
      }
      if (video.getAttribute('src') === null) video.src = videoSrc;
      // Autoplay can be denied by browser/user settings; the poster stays visible.
      void video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) video.poster = imageSrc;
      updatePlayback();
    });
    observer.observe(video);
    reducedMotion.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);
    return () => {
      observer.disconnect();
      video.pause();
      reducedMotion.removeEventListener('change', updatePlayback);
      document.removeEventListener('visibilitychange', updatePlayback);
    };
  }, [imageSrc, videoSrc]);

  return (
    <div className={styles.featureItem}>
      <video
        ref={videoRef}
        className={styles.featureImage}
        muted
        loop
        playsInline
        preload="none"
        aria-label={title}
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
