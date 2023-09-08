import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

// hero
import heroImage from '../../assets/images/hero.png';
import heroWebpLarge from '../../assets/images/hero-lg.webp';
import heroWebpSmall from '../../assets/images/hero-sm.webp';

// free
import freeMP4 from '../../assets/images/free.mp4';
import freeWebm from '../../assets/images/free.webm';

// find
import findMP4 from '../../assets/images/find.mp4';
import findWebm from '../../assets/images/find.webm';

// trending
import trendingMP4 from '../../assets/images/trending.mp4';
import trendingWebm from '../../assets/images/trending.webm';

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
          <source
            src={heroImage}
            className={styles.heroImage}
            type="image/webp"
            srcSet={`${heroWebpSmall} 700w, ${heroWebpLarge} 2000w`}
          />
          <img className={styles.heroImage} src={heroImage}></img>
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
            <FeatureItem webmUrl={trendingWebm} mp4Url={trendingMP4} title="See trending gif" />
            <FeatureItem webmUrl={findWebm} mp4Url={findMP4} title="Find gif for fre" />
            <FeatureItem webmUrl={freeWebm} mp4Url={freeMP4} title="Free for everyone" />
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
