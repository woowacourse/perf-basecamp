import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.webp';
import heroImageJPG from '../../assets/images/hero.jpg';

import trendingMP4 from '../../assets/images/trending.mp4';
import trendingWEBM from '../../assets/images/trending.webm';
import findMP4 from '../../assets/images/find.mp4';
import findWEBM from '../../assets/images/find.webm';
import freeMP4 from '../../assets/images/free.mp4';
import freeWEBM from '../../assets/images/free.webm';

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
          <source className={styles.heroImage} srcSet={heroImage} type="image/webp" />
          <img className={styles.heroImage} src={heroImageJPG} alt="hero image" />
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
            <FeatureItem title="See trending gif">
              <source src={trendingWEBM} type="video/webm" />
              <source src={trendingMP4} type="video/mp4" />
            </FeatureItem>
            <FeatureItem title="Find gif for free">
              <source src={findWEBM} type="video/webm" />
              <source src={findMP4} type="video/mp4" />
            </FeatureItem>
            <FeatureItem title="Free for everyone">
              <source src={freeWEBM} type="video/webm" />
              <source src={freeMP4} type="video/mp4" />
            </FeatureItem>
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
