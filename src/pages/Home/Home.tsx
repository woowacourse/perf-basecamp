import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.jpg';
import heroImageXL from '../../assets/images/hero-xl.webp';
import heroImageL from '../../assets/images/hero-l.webp';
import heroImageM from '../../assets/images/hero-m.webp';
import heroImageS from '../../assets/images/hero-s.webp';
import heroImageXS from '../../assets/images/hero-xs.webp';
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
          <source type="image/webp" srcSet={heroImageXS} media="(max-width:480px)" />
          <source type="image/webp" srcSet={heroImageS} media="(max-width:768px)" />
          <source type="image/webp" srcSet={heroImageM} media="(max-width:1024px)" />
          <source type="image/webp" srcSet={heroImageL} media="(max-width:1280px)" />
          <source type="image/webp" srcSet={heroImageXL} media="(max-width:1920px)" />
          <img
            className={styles.heroImage}
            src={heroImage}
            alt="Memegle gif search engine for you"
          />
        </picture>
        <div className={styles.projectTitle}>
          <h2 className={styles.title}>Memegle</h2>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
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
            <FeatureItem title="See trending gif" imageSrc={trendingMp4} />
            <FeatureItem title="Find gif for free" imageSrc={findMp4} />
            <FeatureItem title="Free for everyone" imageSrc={freeMp4} />
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
