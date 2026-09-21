import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './FeatureItem.module.css';

const cx = classNames.bind(styles);

interface FeatureItemProps {
  title: string;
  videoSrc: string;
}

const FeatureItem = ({ title, videoSrc }: FeatureItemProps): JSX.Element => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setShouldLoad(true);
  }, []);

  return (
    <div className={styles.featureItem}>
      {!isLoaded && <div className={styles.skeleton} />}
      <video
        className={cx('featureImage', { featureImageLoaded: isLoaded })}
        src={shouldLoad ? videoSrc : undefined}
        preload="none"
        onLoadedData={() => setIsLoaded(true)}
        autoPlay
        loop
        playsInline
        muted
      />
      <div className={styles.featureTitleBg}></div>
      <h3 className={styles.featureTitle}>{title}</h3>
    </div>
  );
};

export default FeatureItem;
