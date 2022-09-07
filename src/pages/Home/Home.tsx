import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroDesktopImage from '../../assets/images/hero_desktop.webp';
import heroTabletImage from '../../assets/images/hero_tablet.webp';
import heroMobileImage from '../../assets/images/hero_mobile.webp';
import trendingWebm from '../../assets/images/trending.webm';
import findWebm from '../../assets/images/find.webm';
import freeWebm from '../../assets/images/free.webm';
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
        <img
          className={styles.heroImage}
          src={heroDesktopImage}
          alt="hero image"
          srcSet={`${heroDesktopImage} 1920w,
        ${heroTabletImage} 1366w,
        ${heroMobileImage} 640w,
        `}
        />
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
              videoMp4Src={trendingMp4}
              videoWebmSrc={trendingWebm}
            />
            <FeatureItem title="Find gif for free" videoMp4Src={findMp4} videoWebmSrc={findWebm} />
            <FeatureItem title="Free for everyone" videoMp4Src={freeMp4} videoWebmSrc={freeWebm} />
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
