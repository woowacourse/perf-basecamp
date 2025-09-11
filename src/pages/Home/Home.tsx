import classNames from 'classnames/bind';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

import findMP4 from '../../assets/images/find.mp4';
import freeMP4 from '../../assets/images/free.mp4';
import trendingMP4 from '../../assets/images/trending.mp4';

import findWebm from '../../assets/images/find.webm';
import freeWebm from '../../assets/images/free.webm';
import trendingWebm from '../../assets/images/trending.webm';

import heroImage1920_webp from '../../assets/images/hero/hero-1920.webp';
import heroImage1280_webp from '../../assets/images/hero/hero-1280.webp';
import heroImage768_webp from '../../assets/images/hero/hero-768.webp';
import heroImage480_webp from '../../assets/images/hero/hero-480.webp';

import heroImage1920_jpg from '../../assets/images/hero/hero-1920.jpg';
import heroImage1280_jpg from '../../assets/images/hero/hero-1280.jpg';
import heroImage768_jpg from '../../assets/images/hero/hero-768.jpg';
import heroImage480_jpg from '../../assets/images/hero/hero-480.jpg';

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
        <picture>
          <source
            type="image/webp"
            srcSet={`
            ${heroImage480_webp} 480w,
            ${heroImage768_webp} 768w,
            ${heroImage1280_webp} 1280w,
            ${heroImage1920_webp} 1920w
          `}
            sizes="(max-width: 600px) 100vw,
                 (max-width: 1200px) 90vw,
                 1200px"
          />

          {/* JPG fallback */}
          <source
            type="image/jpeg"
            srcSet={`
            ${heroImage480_jpg} 480w,
            ${heroImage768_jpg} 768w,
            ${heroImage1280_jpg} 1280w,
            ${heroImage1920_jpg} 1920w
          `}
            sizes="(max-width: 600px) 100vw,
                 (max-width: 1200px) 90vw,
                 1200px"
          />

          <img
            className={styles.heroImage}
            src="/images/hero-1280.jpg"
            alt="hero image"
            width="1372"
            height="915"
            loading="eager"
            decoding="async"
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
            <FeatureItem title="See trending gif" webmSrc={trendingWebm} mp4Src={trendingMP4} />
            <FeatureItem title="Find gif for free" mp4Src={findMP4} webmSrc={findWebm} />
            <FeatureItem title="Free for everyone" mp4Src={freeMP4} webmSrc={freeWebm} />
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
