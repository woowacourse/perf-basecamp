import { useEffect, useRef, useState } from 'react';

import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  videoSrc: string;
}

const VIDEO_LOAD_ROOT_MARGIN = '200px';

const FeatureItem = ({ title, videoSrc }: FeatureItemProps): JSX.Element => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

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
