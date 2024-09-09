import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroMobileWebp from '../../assets/images/hero-768.webp';
import heroMobileJpg from '../../assets/images/hero-768.jpg';
import heroTabletWebp from '../../assets/images/hero-1024.webp';
import heroTabletJpg from '../../assets/images/hero-1024.jpg';
import heroDesktopWebp from '../../assets/images/hero-1440.webp';
import heroDesktopJpg from '../../assets/images/hero-1440.jpg';

import trendingMp4 from '../../assets/images/trending.mp4';
import trendingWebm from '../../assets/images/trending.webm';
import findMp4 from '../../assets/images/find.mp4';
import findWebm from '../../assets/images/find.webm';
import freeMp4 from '../../assets/images/free.mp4';
import freeWebm from '../../assets/images/free.webm';

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
          <source srcSet={heroDesktopWebp} type="image/webp" media="(min-width: 1440px)" />
          <source srcSet={heroDesktopJpg} type="image/jpeg" media="(min-width: 1440px)" />

          <source
            srcSet={heroTabletWebp}
            type="image/webp"
            media="(min-width: 1024px) and (max-width: 1439px)"
          />
          <source
            srcSet={heroTabletJpg}
            type="image/jpeg"
            media="(min-width: 1024px) and (max-width: 1439px)"
          />

          <source srcSet={heroMobileWebp} type="image/webp" media="(max-width: 1023px)" />
          <source srcSet={heroMobileJpg} type="image/jpeg" media="(max-width: 1023px)" />

          <img src={heroMobileJpg} alt="Hero Image" className={styles.heroImage} />
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
          <h3 className={styles.featureTitle}>Features</h3>
          <div className={styles.featureItemContainer}>
            <FeatureItem title="See trending gif" mp4Src={trendingMp4} webmSrc={trendingWebm} />
            <FeatureItem title="Find gif for free" mp4Src={findMp4} webmSrc={findWebm} />
            <FeatureItem title="Free for everyone" mp4Src={freeMp4} webmSrc={freeWebm} />
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
