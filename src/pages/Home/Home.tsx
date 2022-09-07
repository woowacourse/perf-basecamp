import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage_jpg_desktop from '../../assets/images/hero-1920w.jpg';
import heroImage_jpg_tablet from '../../assets/images/hero-1024w.jpg';
import heroImage_jpg_mobile from '../../assets/images/hero-768w.jpg';
import heroImage_webp_desktop from '../../assets/images/hero-1920w.webp';
import heroImage_webp_tablet from '../../assets/images/hero-1024w.webp';
import heroImage_webp_mobile from '../../assets/images/hero-768w.webp';
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
          <source srcSet={heroImage_webp_mobile} type="image/webp" media="(max-width: 768px)" />
          <source srcSet={heroImage_webp_tablet} type="image/webp" media="(max-width: 1024px)" />
          <source srcSet={heroImage_webp_desktop} type="image/webp" media="(max-width: 1920px)" />
          <source srcSet={heroImage_jpg_mobile} type="image/jpg" media="(max-width: 768px)" />
          <source srcSet={heroImage_jpg_tablet} type="image/jpg" media="(max-width: 1024px)" />
          <source srcSet={heroImage_jpg_desktop} type="image/jpg" media="(max-width: 1920px)" />
          <img className={styles.heroImage} src={heroImage_jpg_desktop} alt="hero" />
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
