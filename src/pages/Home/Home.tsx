import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import hero_desktop from '../../assets/images/hero_desktop.avif';
import hero_tablet from '../../assets/images/hero_tablet.webp';
import hero_mobile from '../../assets/images/hero_mobile.webp';

import heroImage from '../../assets/images/hero.png';

import trendingVedio from '../../assets/images/trending.mp4';
import findVedio from '../../assets/images/find.mp4';
import freeVedio from '../../assets/images/free.mp4';

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
            srcSet={`
            ${hero_mobile} 375w,
            ${hero_tablet} 768w,
            ${hero_desktop} 1980w
          `}
            className={styles.heroImage}
          />
          <img className={styles.heroImage} src={heroImage} alt="hero" />
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
            <FeatureItem title="See trending gif" imageSrc={trendingVedio} />
            <FeatureItem title="Find gif for free" imageSrc={findVedio} />
            <FeatureItem title="Free for everyone" imageSrc={freeVedio} />
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
