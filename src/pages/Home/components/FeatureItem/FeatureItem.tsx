import { useEffect, useRef, useState } from 'react';

import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  const featureRef = useRef<HTMLDivElement>(null);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);

  useEffect(() => {
    const feature = featureRef.current;
    if (feature === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoadImage(true);
        observer.disconnect();
      },
      { rootMargin: '200px' }
    );

    observer.observe(feature);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={featureRef} className={styles.featureItem}>
      <img
        className={styles.featureImage}
        src={shouldLoadImage ? imageSrc : undefined}
        loading="lazy"
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
