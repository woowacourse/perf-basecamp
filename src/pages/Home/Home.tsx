import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImageAvif from '../../assets/images/hero.avif';
import heroImageWebp from '../../assets/images/hero.webp';
import heroImagePng from '../../assets/images/hero.png';
import trendingMp4 from '../../assets/videos/trending.mp4';
import findMp4 from '../../assets/videos/find.mp4';
import freeMp4 from '../../assets/videos/free.mp4';

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
          <source className={styles.heroImage} srcSet={heroImageAvif} type="image/avif" />
          <source className={styles.heroImage} srcSet={heroImageWebp} type="image/webp" />
          <img className={styles.heroImage} src={heroImagePng} alt="hero image" />
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
            <FeatureItem title="See trending gif" videoSrc={trendingMp4} />
            <FeatureItem title="Find gif for free" videoSrc={findMp4} />
            <FeatureItem title="Free for everyone" videoSrc={freeMp4} />
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
