import { useEffect, useRef, useState } from 'react';

import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  videoSrc: string;
}

const VIDEO_LOAD_ROOT_MARGIN = '200px'; // 화면에 들어오기 조금 전에 미리 받아 재생이 끊기지 않도록 함

const FeatureItem = ({ title, videoSrc }: FeatureItemProps): JSX.Element => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  // The videos sit below the fold, so fetching them up front only steals bandwidth from the hero image.
  useEffect(() => {
    const item = itemRef.current;

    if (item === null) return () => undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: VIDEO_LOAD_ROOT_MARGIN }
    );

    observer.observe(item);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={itemRef} className={styles.featureItem}>
      <video
        className={styles.featureImage}
        src={isNearViewport ? videoSrc : undefined}
        preload="none"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
