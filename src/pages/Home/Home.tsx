import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.png';
import trendingGif from '../../assets/images/trending.mp4';
import findGif from '../../assets/images/find.mp4';
import freeGif from '../../assets/images/free.mp4';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';
import { MOBILE_MEDIA_QUERY_SIZE } from '../../constants/ui';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const isMobileType = window.matchMedia(MOBILE_MEDIA_QUERY_SIZE).matches;
  const videoSrcList: string[] = [trendingGif, findGif, freeGif];
  const [loadedVideos, setLoadedVideos] = useState<number[]>([]);

  const initialOption = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && !loadedVideos.includes(index)) {
          const videoElement = entry.target as HTMLVideoElement;
          const videoSrcIndex = Number(videoElement.getAttribute('data-index'));

          const sourceElement = videoElement?.querySelector('source') as HTMLSourceElement;

          if (!sourceElement.src) {
            sourceElement.src = videoSrcList[videoSrcIndex];

            videoElement.load();

            setLoadedVideos([...loadedVideos, videoSrcIndex]);
          }
        }
      });
    }, initialOption);

    const targets = document.querySelectorAll('.show-on-scroll');

    targets.forEach((target) => {
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [loadedVideos.length !== videoSrcList.length]);

  return (
    <>
      <section className={styles.heroSection}>
        <img className={styles.heroImage} src={heroImage} alt="hero image" />
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h2 className={styles.subtitle}>gif search engine for you</h2>
        </div>
        <Link to="/search">
          <button className={classNames(styles.cta, styles.linkButton)}>start search</button>
        </Link>
      </section>
      <section ref={wrapperRef} className={styles.featureSection}>
        <AnimatedPath wrapperRef={wrapperRef} />
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem title="See trending gif" index={0} />
            <FeatureItem title="Find gif for free" index={1} />
            <FeatureItem title="Free for everyone" index={2} />
          </div>
          <Link to="/search">
            <button className={styles.linkButton}>start search</button>
          </Link>
        </div>
      </section>
      {!isMobileType && <CustomCursor text="memegle" />}
    </>
  );
};

export default Home;
