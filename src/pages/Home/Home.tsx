import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImageDesktopWebp from '../../assets/images/hero/hero-desktop.webp';
import heroImageDesktopAvif from '../../assets/images/hero/hero-desktop.avif';
import heroImageTabletWebp from '../../assets/images/hero/hero-tablet.webp';
import heroImageTabletAvif from '../../assets/images/hero/hero-tablet.avif';
import heroImageMobileWebp from '../../assets/images/hero/hero-mobile.webp';
import heroImageMobileAvif from '../../assets/images/hero/hero-mobile.avif';
import heroImageJpg from '../../assets/images/hero/hero.jpg';
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
          {/* 데스크탑 (1200px 이상) */}
          <source srcSet={heroImageDesktopAvif} type="image/avif" media="(min-width: 1200px)" />
          <source srcSet={heroImageDesktopWebp} type="image/webp" media="(min-width: 1200px)" />

          {/* 태블릿 (768px ~ 1199px) */}
          <source srcSet={heroImageTabletAvif} type="image/avif" media="(min-width: 768px)" />
          <source srcSet={heroImageTabletWebp} type="image/webp" media="(min-width: 768px)" />

          {/* 모바일 (최대 767px) */}
          <source srcSet={heroImageMobileAvif} type="image/avif" media="(max-width: 767px)" />
          <source srcSet={heroImageMobileWebp} type="image/webp" media="(max-width: 767px)" />

          {/* 최종 fallback */}
          <img className={styles.heroImage} src={heroImageJpg} alt="hero image" />
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
            <FeatureItem title="See trending gif" videoSrc={trendingMp4} />
            <FeatureItem title="Find gif for free" videoSrc={findMp4} />
            <FeatureItem title="Free for everyone" videoSrc={freeMp4} />
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
