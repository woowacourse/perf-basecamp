import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.png';
import trendingMp4 from '../../assets/images/trending.mp4';
import findMp4 from '../../assets/images/find.mp4';
import freeMp4 from '../../assets/images/free.mp4';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const cx = classNames.bind(styles);

const toWebp = (suffix?: number) =>
  heroImage.replace(/\/([^/]+)\.png$/, (_: string, name: string) =>
    suffix ? `/${name}-${suffix}.webp` : `/${name}.webp`
  );

const heroWebp480 = toWebp(480);
const heroWebp1200 = toWebp(1200);
const heroWebp1920 = toWebp();

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source
            type="image/webp"
            srcSet={`${heroWebp480} 480w, ${heroWebp1200} 1200w, ${heroWebp1920} 1920w`}
            sizes="(max-width: 600px) 480px, (max-width: 1200px) 1200px, 1920px"
          />
          <img className={styles.heroImage} src={heroImage} alt="Hero" />
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
            <FeatureItem title="See trending gif" mp4={trendingMp4} />
            <FeatureItem title="Find gif for free" mp4={findMp4} />
            <FeatureItem title="Free for everyone" mp4={freeMp4} />
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
