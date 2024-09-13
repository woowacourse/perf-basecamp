import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImagePng from '../../assets/images/hero.png';
import heroImage360 from '../../assets/images/hero-360.webp';
import heroImage640 from '../../assets/images/hero-640.webp';
import heroImage1280 from '../../assets/images/hero-1280.webp';
import heroImage1920 from '../../assets/images/hero-1920.webp';
import trendingGif from '../../assets/images/trending.gif';
import trendingMp4 from '../../assets/images/trending.mp4';
import trendingWebm from '../../assets/images/trending.webm';
import findGif from '../../assets/images/find.gif';
import findMp4 from '../../assets/images/find.mp4';
import findWebm from '../../assets/images/find.webm';
import freeGif from '../../assets/images/free.gif';
import freeMp4 from '../../assets/images/free.mp4';
import freeWebm from '../../assets/images/free.webm';

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
            srcSet={`${heroImage360} 360w, ${heroImage640} 640w, ${heroImage1280} 1280w, ${heroImage1920} 1920w`}
            sizes="(max-width: 360px) 360px, (max-width: 640px) 640px, (max-width: 1280px) 1280px, 100vw"
            type="image/webp"
          />
          <source srcSet={heroImagePng} type="image/png" />
          <img className={styles.heroImage} src={heroImagePng} alt="hero image" />
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
            <FeatureItem
              title="See trending gif"
              gifSrc={trendingGif}
              mp4Src={trendingMp4}
              webmSrc={trendingWebm}
            />
            <FeatureItem
              title="Find gif for free"
              gifSrc={findGif}
              mp4Src={findMp4}
              webmSrc={findWebm}
            />
            <FeatureItem
              title="Free for everyone"
              gifSrc={freeGif}
              mp4Src={freeMp4}
              webmSrc={freeWebm}
            />
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
