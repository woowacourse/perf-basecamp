import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.png';
import heroImageWebp from '../../assets/images/hero.webp';
import trendingGifWebp from '../../assets/images/trending.webm';
import trendingGifMp4 from '../../assets/images/trending.mp4';
import findGifWebp from '../../assets/images/find.webm';
import findGifMp4 from '../../assets/images/find.mp4';
import freeGifWebp from '../../assets/images/free.webm';
import freeGifMp4 from '../../assets/images/free.mp4';

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
          <source srcSet={heroImageWebp} type="image/webp" />
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
              mp4Src={trendingGifMp4}
              webmSrc={trendingGifWebp}
            />
            <FeatureItem title="Find gif for free" mp4Src={findGifMp4} webmSrc={findGifWebp} />
            <FeatureItem title="Free for everyone" mp4Src={freeGifMp4} webmSrc={freeGifWebp} />
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
