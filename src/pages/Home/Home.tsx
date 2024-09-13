import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage_1920 from '../../assets/images/hero1920.webp';
import heroImage_1280 from '../../assets/images/hero1280.webp';
import heroImage_768 from '../../assets/images/hero768.webp';
import heroImage_400 from '../../assets/images/hero400.webp';
import trendingVideo from '../../assets/images/trending.webm';
import findVideo from '../../assets/images/find.webm';
import freeGVideo from '../../assets/images/free.webm';

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
            type="image/webp"
            className={styles.heroImage}
            src={heroImage_1280}
            srcSet={`${heroImage_1920} 1920w, ${heroImage_768} 768w, ${heroImage_400} 400w`}
          />
          <img className={styles.heroImage} src={heroImage_1280} alt="hero" />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h2 className={styles.subtitle}>gif search engine for you</h2>
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
            <FeatureItem title="See trending gif" videoSrc={trendingVideo} />
            <FeatureItem title="Find gif for free" videoSrc={findVideo} />
            <FeatureItem title="Free for everyone" videoSrc={freeGVideo} />
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
