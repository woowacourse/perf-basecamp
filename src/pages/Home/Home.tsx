import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.jpg';
import heroImageWebp from '../../assets/images/hero.webp';
import heroImageAvif from '../../assets/images/hero.avif';
import trendingVideo from '../../assets/images/trending.mp4';
import trendingPoster from '../../assets/images/trending.jpg';
import findVideo from '../../assets/images/find.mp4';
import findPoster from '../../assets/images/find.jpg';
import freeVideo from '../../assets/images/free.mp4';
import freePoster from '../../assets/images/free.jpg';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source type="image/avif" srcSet={heroImageAvif} />
          <source type="image/webp" srcSet={heroImageWebp} />
          <source type="image/jpg" srcSet={heroImage} />
          <img className={styles.heroImage} src={heroImage} alt="hero image" />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to="/search">
          <button className={classNames(styles.cta, styles.linkButton)}>start search</button>
        </Link>
      </section>
      <section ref={wrapperRef} className={styles.featureSection}>
        <AnimatedPath wrapperRef={wrapperRef} />
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem
              title="See trending gif"
              videoSrc={trendingVideo}
              imageSrc={trendingPoster}
            />
            <FeatureItem title="Find gif for free" videoSrc={findVideo} imageSrc={findPoster} />
            <FeatureItem title="Free for everyone" videoSrc={freeVideo} imageSrc={freePoster} />
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
