import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroDesktop from '../../assets/images/hero_desktop.webp';
import heroTablet from '../../assets/images/hero_tablet.webp';
import heroMobile from '../../assets/images/hero_mobile.webp';
import heroDefault from '../../assets/images/hero.jpg';

import trendingGif from '../../assets/images/trending.webm';
import findGif from '../../assets/images/find.webm';
import freeGif from '../../assets/images/free.webm';
import altTrendingGif from '../../assets/images/trending.mp4';
import altFindGif from '../../assets/images/find.mp4';
import altFreeGif from '../../assets/images/free.mp4';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <picture className={styles.heroImage}>
          <source
            type="image/webp"
            src={heroDesktop}
            srcSet={`${heroDesktop} 1920w, ${heroTablet} 1280w, ${heroMobile} 767w`}
          ></source>
          <img className={styles.heroImage} src={heroDefault} alt="hero image" />
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
            <FeatureItem
              title="See trending gif"
              imageSrc={trendingGif}
              altImageSrc={altTrendingGif}
            />
            <FeatureItem title="Find gif for free" imageSrc={findGif} altImageSrc={altFindGif} />
            <FeatureItem title="Free for everyone" imageSrc={freeGif} altImageSrc={altFreeGif} />
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
