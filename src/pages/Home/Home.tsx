import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImageMobile from '../../assets/images/hero-375.webp';
import heroImageTablet from '../../assets/images/hero-768.webp';
import heroImageDesktop from '../../assets/images/hero-1980.webp';

import trendingGif from '../../assets/images/trending.mp4';
import findGif from '../../assets/images/find.mp4';
import freeGif from '../../assets/images/free.mp4';

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
          <source
            type="image/webp"
            src={heroImageDesktop}
            srcSet={`${heroImageMobile} 375w, ${heroImageTablet} 768w, ${heroImageDesktop} 1980w`}
          />
          <img className={styles.heroImage} src={heroImageDesktop} alt="hero image" />
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
            <FeatureItem title="See trending gif" imageSrc={trendingGif} />
            <FeatureItem title="Find gif for free" imageSrc={findGif} />
            <FeatureItem title="Free for everyone" imageSrc={freeGif} />
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
