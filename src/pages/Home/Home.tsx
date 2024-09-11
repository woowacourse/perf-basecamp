import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.jpeg';
import heroImageSmall from '../../assets/images/hero-small.jpeg';
import heroImageWebp from '../../assets/images/hero.webp';
import heroImageSmallWebp from '../../assets/images/hero-small.webp';

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

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source
            srcSet={`${heroImageSmallWebp} 1025w, ${heroImageWebp} 2050w`}
            sizes="100vw"
            type="image/webp"
          />

          <img
            className={styles.heroImage}
            src={heroImage}
            alt="hero image"
            srcSet={`${heroImageSmall} 1025w, ${heroImage} 2050w`}
            sizes="100vw"
          />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h2 className={styles.subtitle}>gif search engine for you</h2>
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
              imageSrc={trendingWebm}
              fallbackSrc={trendingMp4}
            />
            <FeatureItem title="Find gif for free" imageSrc={findWebm} fallbackSrc={findMp4} />
            <FeatureItem title="Free for everyone" imageSrc={freeWebm} fallbackSrc={freeMp4} />
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
