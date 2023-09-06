import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImageDesktop from '../../assets/images/hero-desktop.webp';
import heroImageMobile from '../../assets/images/hero-mobile.webp';
import heroImageTablet from '../../assets/images/hero-tablet.webp';
import heroImage from '../../assets/images/hero.png';
import trendingGif from '../../assets/images/trending.gif';
import findGif from '../../assets/images/find.gif';
import freeGif from '../../assets/images/free.gif';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  //           srcSet={`${heroImageMobile} 375w, ${heroImageTablet} 768w, ${heroImageDesktop} 1980w`}

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source
            type="image/webp"
            srcSet={`${heroImageMobile} 376w, ${heroImageTablet} 769w, ${heroImageDesktop} 1981w`}
          />
          <img loading="lazy" className={styles.heroImage} src={heroImage} alt="hero image" />
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
