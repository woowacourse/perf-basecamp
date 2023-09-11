import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.png';
import heroLgImage from '../../assets/images/hero-lg.webp';
import heroMdImage from '../../assets/images/hero-md.webp';
import heroSmImage from '../../assets/images/hero-sm.webp';

import trendingMp4 from '../../assets/images/trending.mp4';
import trendingWebm from '../../assets/images/trending.webm';
import findMp4 from '../../assets/images/find.mp4';
import findWebm from '../../assets/images/find.webm';
import freeMp4 from '../../assets/images/free.mp4';
import freeWebm from '../../assets/images/free.webm';

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
            type="image/webp"
            src={heroLgImage}
            srcSet={`${heroSmImage} 500w, ${heroMdImage} 1000w,${heroLgImage} 2000vw`}
          />
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
            <FeatureItem title="See trending gif" mp4Src={trendingMp4} webmSrc={trendingWebm} />
            <FeatureItem title="Find gif for free" mp4Src={findMp4} webmSrc={findWebm} />
            <FeatureItem title="Free for everyone" mp4Src={freeMp4} webmSrc={freeWebm} />
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
