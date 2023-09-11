import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import heroImageResponsive from '../../assets/images/hero.png';
import trendingVideo from '../../assets/images/trending.webm';
import findVideo from '../../assets/images/find.webm';
import freeVideo from '../../assets/images/free.webm';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';
import gifStorage from '../Search/utils/gifStorage';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gifStorage.preLoad();
    import('../Search/Search');
  }, []);

  return (
    <>
      <section className={styles.heroSection}>
        <img
          className={styles.heroImage}
          srcSet={heroImageResponsive.srcSet}
          width={heroImageResponsive.width}
          height={heroImageResponsive.height}
          alt="hero image"
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
            <FeatureItem title="See trending gif" videoSrc={trendingVideo} />
            <FeatureItem title="Find gif for free" videoSrc={findVideo} />
            <FeatureItem title="Free for everyone" videoSrc={freeVideo} />
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
