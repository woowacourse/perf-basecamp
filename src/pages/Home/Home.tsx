import classNames from 'classnames/bind';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

import findGif from '../../assets/images/find.gif?as=webp';
import freeGif from '../../assets/images/free.gif?as=webp';
import heroImage from '../../assets/images/hero.png?as=webp&w=1200';
import trendingGif from '../../assets/images/trending.gif?as=webp';

import AnimatedPath from './components/AnimatedPath/AnimatedPath';
import CustomCursor from './components/CustomCursor/CustomCursor';
import FeatureItem from './components/FeatureItem/FeatureItem';

import styles from './Home.module.css';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.imageWrapper}>
          <img className={styles.heroImage} src={heroImage} alt="hero image" />
        </div>
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
            <FeatureItem title="See trending gif" imageSrc={trendingGif} />
            <FeatureItem title="Find gif for free" imageSrc={findGif} />
            <FeatureItem title="Free for everyone" imageSrc={freeGif} />
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
