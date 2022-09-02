import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage_480w from '../../assets/images/hero-480w.webp';
import heroImage_800w from '../../assets/images/hero-800w.webp';
import heroImage_1200w from '../../assets/images/hero-1200w.webp';

import trendingVideo from '../../assets/videos/trending.mp4';
import findVideo from '../../assets/videos/find.mp4';
import freeVideo from '../../assets/videos/free.mp4';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source className={styles.heroImage} media="(max-width: 480px)" srcSet={heroImage_480w} />
          <source className={styles.heroImage} media="(max-width: 800px)" srcSet={heroImage_800w} />
          <img className={styles.heroImage} src={heroImage_1200w} alt="hero image" />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
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
            <FeatureItem title="See trending gif" videoSrc={trendingVideo} />
            <FeatureItem title="Find gif for free" videoSrc={findVideo} />
            <FeatureItem title="Free for everyone" videoSrc={freeVideo} />
          </div>
          <Link to="/search">
            <button className={styles.linkButton}>start search</button>
          </Link>
        </div>
      </section>
      <CustomCursor text="memegle" />
    </>
  );
};

export default Home;
