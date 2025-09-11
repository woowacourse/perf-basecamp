import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.png';
import trendingGif from '../../assets/images/trending.gif';
import findGif from '../../assets/images/find.gif';
import freeGif from '../../assets/images/free.gif';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import { getAssetSrc, getOptimizedAssetSrcSet } from '../../utils/changeImageExtension';

import styles from './Home.module.css';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  const heroImageSrc = getAssetSrc(heroImage, 'png');
  const heroImageWebpSrcSet = getOptimizedAssetSrcSet(heroImage, 'webp');
  const heroImageAvifSrcSet = getOptimizedAssetSrcSet(heroImage, 'avif');

  const isProduction = process.env.NODE_ENV === 'production';
  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          {isProduction && (
            <>
              <source srcSet={heroImageAvifSrcSet} type="image/avif" />
              <source srcSet={heroImageWebpSrcSet} type="image/webp" />
            </>
          )}
          <img
            src={heroImageSrc}
            alt="Hero"
            sizes="(max-width: 600px) 400px,
             (max-width: 1200px) 1200px,
             1600px"
            className={styles.heroImage}
          />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h2 className={styles.subtitle}>gif search engine for you</h2>
        </div>
        <Link to="/search">
          <button type="button" className={cx('cta', 'linkButton')}>
            start search
          </button>
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
            <button type="button" className={styles.linkButton}>
              start search
            </button>
          </Link>
        </div>
      </section>
      <CustomCursor text="memegle" />
    </>
  );
};

export default Home;
