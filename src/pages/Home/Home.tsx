import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';
import HeroImage from './components/HeroImage/HeroImage';
import TrendingFeatureItem from './components/TrendingFeatureItem/TrendingFeatureItem';
import FindFeatureItem from './components/FindFeatureItem/FindFeatureItem';
import FreeFeatureItem from './components/FreeFeatureItem/FreeFeatureItem';

import styles from './Home.module.css';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <HeroImage />
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
            <TrendingFeatureItem />
            <FindFeatureItem />
            <FreeFeatureItem />
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
