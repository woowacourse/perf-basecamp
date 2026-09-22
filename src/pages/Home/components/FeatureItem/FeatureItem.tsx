import { useEffect, useRef, useState } from 'react';
import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  videoSrc: string;
};

const FeatureItem = ({ title, videoSrc }: FeatureItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldLoad(true);
        observer.disconnect();
      },
      {
        rootMargin: '0px 0px 200px 0px'
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={itemRef} className={styles.featureItem}>
      {shouldLoad && (
        <video
          className={styles.featureImage}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
      )}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
