import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroDesktopImageWebp from '../../assets/images/hero-1980-webp.webp';
import heroTabletImageWebp from '../../assets/images/hero-768-webp.webp';
import heroMobileImageWebp from '../../assets/images/hero-375-webp.webp';
import heroDesktopImageAvif from '../../assets/images/hero-1980-avif.avif';
import heroTabletImageAvif from '../../assets/images/hero-768-avif.avif';
import heroMobileImageAvif from '../../assets/images/hero-375-avif.avif';
import heroImage from '../../assets/images/hero.jpg';

import trendingMp4 from '../../assets/images/trending.mp4';
import findMp4 from '../../assets/images/find.mp4';
import freeMp4 from '../../assets/images/free.mp4';

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
          <source type='image/avif' media='(min-width: 769px)' srcSet={heroDesktopImageAvif} />
          <source type='image/avif' media='(min-width: 376px)' srcSet={heroTabletImageAvif} />
          <source type='image/avif' media='(min-width: 0px)' srcSet={heroMobileImageAvif} />
          <source type='image/webp' media='(min-width: 376px)' srcSet={heroTabletImageWebp} />
          <source type='image/webp' media='(min-width: 769px)' srcSet={heroDesktopImageWebp} />
          <source type='image/webp' media='(min-width: 0px)' srcSet={heroMobileImageWebp} />
          <img className={styles.heroImage} src={heroImage} alt='hero' />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to='/search'>
          <button className={classNames(styles.cta, styles.linkButton)}>start search</button>
        </Link>
      </section>
      <section ref={wrapperRef} className={styles.featureSection}>
        <AnimatedPath wrapperRef={wrapperRef} />
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem title='See trending gif' videoSrc={trendingMp4} />
            <FeatureItem title='Find gif for free' videoSrc={findMp4} />
            <FeatureItem title='Free for everyone' videoSrc={freeMp4} />
          </div>
          <Link to='/search'>
            <button className={styles.linkButton}>start search</button>
          </Link>
        </div>
      </section>
      <CustomCursor text='memegle' />
    </>
  );
};

export default Home;
