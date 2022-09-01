import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage1920 from '../../assets/images/hero-1920.webp';
import heroImage1366 from '../../assets/images/hero-1366.webp';
import heroImage1024 from '../../assets/images/hero-1024.webp';
import heroImage960 from '../../assets/images/hero-960.webp';
import heroImage640 from '../../assets/images/hero-640.webp';
import heroImage320 from '../../assets/images/hero-320.webp';
import trendingWebm from '../../assets/videos/trending.webm';
import findWebm from '../../assets/videos/find.webm';
import freeWebm from '../../assets/videos/free.webm';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <img
          className={styles.heroImage}
          src={heroImage1920}
          srcSet={`
            ${heroImage1366} 1920w,
            ${heroImage1366} 1366w,
            ${heroImage1024} 1024w,
            ${heroImage960} 960w,
            ${heroImage640} 640w,
            ${heroImage320} 320w
          `}
          alt="hero image"
        />
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
            <FeatureItem title="See trending gif" imageSrc={trendingWebm} />
            <FeatureItem title="Find gif for free" imageSrc={findWebm} />
            <FeatureItem title="Free for everyone" imageSrc={freeWebm} />
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
