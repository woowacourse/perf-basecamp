import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.responsive.jpg';
import trendingGif from '../../assets/images/trending.gif?as=webp';
import findGif from '../../assets/images/find.gif?as=webp';
import freeGif from '../../assets/images/free.gif?as=webp';

import styles from './Home.module.css';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';
import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source
            srcSet={heroImage.srcSet}
            type="image/webp"
            sizes="(max-width: 425px) 425px, (max-width: 768px) 768px,(max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 100vw"
          />
          <img className={styles.heroImage} src={heroImage.src} alt="Hero" />
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
