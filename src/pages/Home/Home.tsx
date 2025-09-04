import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import FeatureItem from './components/FeatureItem/FeatureItem';
const AnimatedPath = lazy(() => import('./components/AnimatedPath/AnimatedPath'));
const CustomCursor = lazy(() => import('./components/CustomCursor/CustomCursor'));

import hero440Webp from '../../assets/hero-440.webp';
import hero768Webp from '../../assets/hero-768.webp';
import hero1024Webp from '../../assets/hero-1024.webp';
import hero1280Webp from '../../assets/hero-1280.webp';

import styles from './Home.module.css';
import trendingMp4 from '../../assets/trending.mp4';
import findMp4 from '../../assets/find.mp4';
import freeMp4 from '../../assets/free.mp4';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const [showEnhancements, setShowEnhancements] = useState(false);

  useEffect(() => {
    const idle = (window as any).requestIdleCallback as
      | ((cb: () => void, opts?: { timeout?: number }) => number)
      | undefined;
    if (idle) {
      idle(() => setShowEnhancements(true), { timeout: 2000 });
    } else {
      setTimeout(() => setShowEnhancements(true), 0);
    }
  }, []);

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source
            srcSet={`${hero440Webp} 440w, ${hero768Webp} 768w, ${hero1024Webp} 1024w, ${hero1280Webp} 1280w`}
            sizes="(min-width: 1280px) 1280px, (min-width: 1024px) 1024px, (min-width: 768px) 768px, 440px"
            type="image/webp"
          />
          <img
            className={styles.heroImage}
            src={hero1280Webp}
            srcSet={`${hero440Webp} 440w, ${hero768Webp} 768w, ${hero1024Webp} 1024w, ${hero1280Webp} 1280w`}
            sizes="(min-width: 1280px) 1280px, (min-width: 1024px) 1024px, (min-width: 768px) 768px, 440px"
            alt="hero image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to="/search">
          <button className={cx('cta', 'linkButton')}>start search</button>
        </Link>
      </section>
      <section ref={wrapperRef} className={styles.featureSection}>
        {showEnhancements ? (
          <Suspense fallback={null}>
            <AnimatedPath wrapperRef={wrapperRef} />
          </Suspense>
        ) : null}
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem title="See trending gif" videoSources={trendingMp4} />
            <FeatureItem title="Find gif for free" videoSources={findMp4} />
            <FeatureItem title="Free for everyone" videoSources={freeMp4} />
          </div>
          <Link to="/search">
            <button className={styles.linkButton}>start search</button>
          </Link>
        </div>
      </section>
      {showEnhancements ? (
        <Suspense fallback={null}>
          <CustomCursor text="memegle" />
        </Suspense>
      ) : null}
    </>
  );
};

export default Home;
