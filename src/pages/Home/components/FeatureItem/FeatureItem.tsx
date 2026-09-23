import { useEffect } from 'react';

import useInView from '../../hooks/useInView';

import styles from './FeatureItem.module.css';

interface FeatureItemProps {
  title: string;
  videoSrc: string;
}

const FeatureItem = ({ title, videoSrc }: FeatureItemProps): JSX.Element => {
  const { ref, isInView } = useInView<HTMLVideoElement>();

  useEffect(() => {
    if (!isInView || ref.current === null) return;

    void ref.current.play().catch(() => {});
  }, [isInView, ref]);

  return (
    <div className={styles.featureItem}>
      <video
        ref={ref}
        className={styles.featureImage}
        src={isInView ? videoSrc : undefined}
        preload="none"
        muted
        loop
        playsInline
        aria-label={title}
      />
      <div className={styles.featureTitleBg}></div>
      <h4 className={styles.featureTitle}>{title}</h4>
    </div>
  );
};

export default FeatureItem;
