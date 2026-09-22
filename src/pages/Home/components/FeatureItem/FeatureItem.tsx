import { useEffect, useRef, useState } from 'react';

import styles from './FeatureItem.module.css';

type FeatureItemProps = {
  title: string;
  imageSrc: string;
};

const FeatureItem = ({ title, imageSrc }: FeatureItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [shouldLoadImage, setShouldLoadImage] = useState(false);

  useEffect(() => {
    const item = itemRef.current;

    if (item === null) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setShouldLoadImage(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadImage(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(item);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={itemRef} className={styles.featureItem}>
      {shouldLoadImage && (
        <img className={styles.featureImage} src={imageSrc} alt="" decoding="async" />
      )}
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
