import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroPng from '../../assets/images/hero.png';
import trendingVideo from '../../assets/images/trending.mp4';
import findVideo from '../../assets/images/find.mp4';
import freeVideo from '../../assets/images/free.mp4';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import heroMobileImage from '../../assets/images/hero-375w.webp';
import heroTabletImage from '../../assets/images/hero-768w.webp';
import heroDesktopImage from '../../assets/images/hero-1000w.webp';
import heroFullImage from '../../assets/images/hero-1980w.webp';

import styles from './Home.module.css';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.heroImage}>
          <picture>
            <source
              srcSet={`
      ${heroMobileImage} 375w,
      ${heroTabletImage} 768w,
      ${heroDesktopImage} 1000w,
      ${heroFullImage} 1980w,
    `}
              type="image/webp"
            />
            <img className={styles.heroImage} src={heroPng} alt="Hero Image" />
          </picture>
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
            <FeatureItem title="See trending gif" imageSrc={trendingVideo} />
            <FeatureItem title="Find gif for free" imageSrc={findVideo} />
            <FeatureItem title="Free for everyone" imageSrc={freeVideo} />
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
