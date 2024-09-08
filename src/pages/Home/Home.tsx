import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage_L from '../../assets/images/hero_L.webp';
import heroImage_M from '../../assets/images/hero_M.webp';
import heroImage_S from '../../assets/images/hero_S.webp';
import trendingGif from '../../assets/images/trending.webm';
import findGif from '../../assets/images/find.webm';
import freeGif from '../../assets/images/free.webm';

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
            srcSet={`${heroImage_S} 375w, ${heroImage_M} 768w,${heroImage_L} 1980w`}
            sizes="(max-width: 375px) 375px, (max-width: 768px) 768px, (max-width: 1980px) 1980px, 100vw"
            type="image/webp"
          />
          <img className={styles.heroImage} src={heroImage_L} alt="hero image" sizes="100vw" />
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
