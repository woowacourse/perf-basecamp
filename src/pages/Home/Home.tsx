import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import hero1280Avif from '../../assets/images/hero-1280.avif';
import hero1920Avif from '../../assets/images/hero-1920.avif';
import hero1280Webp from '../../assets/images/hero-1280.webp';
import hero1920Webp from '../../assets/images/hero-1920.webp';
import heroFallback from '../../assets/images/hero-1280.jpg';
import trendingWebp from '../../assets/images/trending.webp';
import findWebp from '../../assets/images/find.webp';
import freeWebp from '../../assets/images/free.webp';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source
            type="image/avif"
            srcSet={`${hero1280Avif} 1280w, ${hero1920Avif} 1920w`}
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet={`${hero1280Webp} 1280w, ${hero1920Webp} 1920w`}
            sizes="100vw"
          />
          <img
            className={styles.heroImage}
            src={heroFallback}
            alt="hero image"
            width={1920}
            height={800}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to="/search">
          <button className={cx('cta', 'linkButton')}>start search</button>
        </Link>
      </section>
      <section ref={wrapperRef} className={styles.featureSection}>
        <AnimatedPath wrapperRef={wrapperRef} />
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem title="See trending gif" imageSrc={trendingWebp} />
            <FeatureItem title="Find gif for free" imageSrc={findWebp} />
            <FeatureItem title="Free for everyone" imageSrc={freeWebp} />
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
