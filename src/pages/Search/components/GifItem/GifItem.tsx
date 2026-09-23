import { memo, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { GifImageModel } from '../../../../types/gifImage';

import styles from './GifItem.module.css';

const cx = classNames.bind(styles);

type GifItemProps = Omit<GifImageModel, 'id'> & {
  priority?: boolean;
};

const GifItem = ({
  imageUrl = '',
  posterUrl,
  videoUrl,
  title = '',
  priority = false
}: GifItemProps): JSX.Element => {
  const itemRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [failedVideoUrl, setFailedVideoUrl] = useState<string | null>(null);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const useVideo =
    videoUrl !== undefined &&
    videoUrl !== '' &&
    posterUrl !== undefined &&
    posterUrl !== '' &&
    failedVideoUrl !== videoUrl;
  const canLoad = priority || shouldLoad;

  useEffect(() => {
    if (priority || shouldLoad) return;

    const item = itemRef.current;
    if (item === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(item);
    return () => observer.disconnect();
  }, [priority, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!useVideo || !canLoad || video === null || videoUrl === undefined || videoUrl === '')
      return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = false;
    const updatePlayback = (): void => {
      if (!isVisible || document.hidden || reducedMotion.matches) {
        video.pause();
        return;
      }

      if (video.getAttribute('src') !== videoUrl) video.src = videoUrl;
      // The real first-frame image remains visible if autoplay is blocked.
      void video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
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
  }, [canLoad, useVideo, videoUrl]);

  return (
    <div ref={itemRef} className={styles.gifItem}>
      <img
        className={styles.gifImage}
        src={canLoad ? (useVideo ? posterUrl : imageUrl) : undefined}
        alt={title}
        width="280"
        height="280"
        loading="eager"
        {...{ fetchpriority: priority ? 'high' : 'low' }}
        decoding="async"
        onError={() => {
          if (useVideo && videoUrl !== undefined) setFailedVideoUrl(videoUrl);
        }}
      />
      {useVideo && canLoad && (
        <video
          ref={videoRef}
          className={cx('gifImage', 'gifVideo', { playing: playingVideoUrl === videoUrl })}
          width="280"
          height="280"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          onPlaying={() => setPlayingVideoUrl(videoUrl ?? null)}
          onError={() => setFailedVideoUrl(videoUrl ?? null)}
        />
      )}
      <div className={styles.gifTitleContainer}>
        <div className={styles.gifTitleBg}></div>
        <h4 className={styles.gifTitle}>{title}</h4>
      </div>
    </div>
  );
};

export default memo(GifItem);
