import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import trendingGif from '../../assets/images/trending.gif';
import trendingWebp from '../../assets/images/trending.webp';
import findWebp from '../../assets/images/find.webp';
import freeWebp from '../../assets/images/free.webp';

import findGif from '../../assets/images/find.gif';
import freeGif from '../../assets/images/free.gif';

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
          <source srcSet={require('@/assets/images/hero.webp')} type="image/webp" />
          <img
            className={styles.heroImage}
            src={require('@/assets/images/hero.png')}
            alt="hero image"
            loading="lazy"
          />
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
              webpSrc={trendingWebp}
              fallbackSrc={trendingGif}
            />
            <FeatureItem title="Find gif for free" webpSrc={findWebp} fallbackSrc={findGif} />
            <FeatureItem title="Free for everyone" webpSrc={freeWebp} fallbackSrc={freeGif} />
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
