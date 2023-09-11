import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.jpg';
import heroImage_webp from '../../assets/images/hero.webp';
import trending_mp4 from '../../assets/videos/trending.mp4';
import trending_webm from '../../assets/videos/trending.webm';
import find_mp4 from '../../assets/videos/find.mp4';
import find_webm from '../../assets/videos/find.webm';
import free_mp4 from '../../assets/videos/free.mp4';
import free_webm from '../../assets/videos/free.webm';

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
          <source srcSet={heroImage_webp} type="image/webp" />
          <img className={styles.heroImage} src={heroImage} alt="hero image" />
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
            <FeatureItem title="See trending gif" webmSrc={trending_webm} mp4Src={trending_mp4} />
            <FeatureItem title="Find gif for free" webmSrc={find_webm} mp4Src={find_mp4} />
            <FeatureItem title="Free for everyone" webmSrc={free_webm} mp4Src={free_mp4} />
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
