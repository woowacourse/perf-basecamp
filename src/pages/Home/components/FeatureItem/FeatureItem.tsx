import { useEffect, useRef, useState } from 'react';

import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrc: string;
};

const FeatureItem = ({ title, videoSrc }: FeatureItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const item = itemRef.current;

    if (item === null) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInViewport(true);
        observer.disconnect();
      }
    });

    observer.observe(item);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={itemRef} className={styles.featureItem}>
      <video
        className={styles.featureClip}
        src={isInViewport ? videoSrc : undefined}
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
