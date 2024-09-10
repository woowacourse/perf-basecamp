import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage_large from '../../assets/images/hero-large.webp';
import heroImage_medium from '../../assets/images/hero-medium.webp';
import heroImage_small from '../../assets/images/hero-small.webp';
import heroImage from '../../assets/images/hero.png';

import trending_webm from '../../assets/images/trending.webm';
import find_webm from '../../assets/images/find.webm';
import free_webm from '../../assets/images/free.webm';

import trending_mp4 from '../../assets/images/trending.mp4';
import find_mp4 from '../../assets/images/find.mp4';
import free_mp4 from '../../assets/images/free.mp4';

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
            type="image/webp"
            srcSet={`${heroImage_small} 500w, ${heroImage_medium} 1000w, ${heroImage_large} 2000w`}
          />
          <img className={styles.heroImage} src={heroImage} alt="hero image" />
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
              imageSrc={trending_webm}
              fallbackImageSrc={trending_mp4}
            />
            <FeatureItem
              title="Find gif for free"
              imageSrc={find_webm}
              fallbackImageSrc={find_mp4}
            />
            <FeatureItem
              title="Free for everyone"
              imageSrc={free_webm}
              fallbackImageSrc={free_mp4}
            />
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
