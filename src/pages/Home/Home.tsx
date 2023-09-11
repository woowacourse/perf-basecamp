import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage_1440w from '../../assets/images/hero_1440w.webp';
import heroImage_768w from '../../assets/images/hero_768w.webp';
import heroImage_375w from '../../assets/images/hero_375w.webp';
import trendingGif from '../../assets/images/trending.webm';
import findGif from '../../assets/images/find.webm';
import freeGif from '../../assets/images/free.webm';

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
          <source media="(max-width: 375px)" srcSet={heroImage_375w} />
          <source media="(max-width: 768px)" srcSet={heroImage_768w} />
          <img className={styles.heroImage} src={heroImage_1440w} alt="hero image" />
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
            <FeatureItem title="See trending gif" webmSrc={trendingGif} />
            <FeatureItem title="Find gif for free" webmSrc={findGif} />
            <FeatureItem title="Free for everyone" webmSrc={freeGif} />
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
