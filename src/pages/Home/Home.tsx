import { useRef } from 'react';
import { Link } from 'react-router-dom';

import heroImage from '../../assets/images/hero.png?as=hero-webp';
import trendingImage from '../../assets/images/trending.gif?as=animated-webp';
import findImage from '../../assets/images/find.gif?as=animated-webp';
import freeImage from '../../assets/images/free.gif?as=animated-webp';

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
          src={heroImage}
          alt=""
          width="1600"
          height="1067"
          fetchpriority="high"
        />
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to="/search">
          <button className={`${styles.cta} ${styles.linkButton}`}>start search</button>
        </Link>
      </section>
      <section ref={wrapperRef} className={styles.featureSection}>
        <AnimatedPath wrapperRef={wrapperRef} />
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem title="See trending gif" imageSrc={trendingImage} />
            <FeatureItem title="Find gif for free" imageSrc={findImage} />
            <FeatureItem title="Free for everyone" imageSrc={freeImage} />
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
