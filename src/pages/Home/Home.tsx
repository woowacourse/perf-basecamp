import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage2000 from '../../assets/images/hero-2000.png';
import heroImage1600 from '../../assets/images/hero-1600.png';
import heroImage1200 from '../../assets/images/hero-1200.png';
import heroImage768 from '../../assets/images/hero-768.png';
import heroImage768Mobile from '../../assets/images/hero-mobile-768.png';
import heroImage480Mobile from '../../assets/images/hero-mobile-480.png';
import trendingGif from '../../assets/images/trending.webp';
import findGif from '../../assets/images/find.webp';
import freeGif from '../../assets/images/free.webp';

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
            type="image/avif"
            media="(max-width: 768px)"
            srcSet="
      /static/hero-mobile-480.avif 480w,
      /static/hero-mobile-768.avif 768w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            media="(max-width: 768px)"
            srcSet="
      /static/hero-mobile-480.webp 480w,
      /static/hero-mobile-768.webp 768w"
            sizes="100vw"
          />
          <source
            type="image/avif"
            srcSet="
      /static/hero-768.avif 768w,
      /static/hero-1200.avif 1200w,
      /static/hero-1600.avif 1600w,
      /static/hero-2000.avif 2000w"
            sizes="(max-width: 1200px) 90vw, 1200px"
          />
          <source
            type="image/webp"
            srcSet="
      /static/hero-768.webp 768w,
      /static/hero-1200.webp 1200w,
      /static/hero-1600.webp 1600w,
      /static/hero-2000.webp 2000w"
            sizes="(max-width: 1200px) 90vw, 1200px"
          />
          <img
            className={styles.heroImage}
            src={
              heroImage2000 ||
              heroImage1600 ||
              heroImage1200 ||
              heroImage768 ||
              heroImage768Mobile ||
              heroImage480Mobile
            }
            fetchPriority="high"
            decoding="async"
            loading="eager"
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
