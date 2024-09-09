import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  const heroImageUrl = `${process.env.IMAGE_URL}/hero.avif`;
  const trendingGifUrl = `${process.env.IMAGE_URL}/trending.avif`;
  const findGifUrl = `${process.env.IMAGE_URL}/find.avif`;
  const freeGifUrl = `${process.env.IMAGE_URL}/free.avif`;

  return (
    <>
      <section className={styles.heroSection}>
        <img
          className={styles.heroImage}
          src={`${heroImageUrl}?w=1920`}
          alt="hero image"
          srcSet={`${heroImageUrl}?w=768 768w, ${heroImageUrl} 1920w`}
        />
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
            <FeatureItem title="See trending gif" imageSrc={trendingGifUrl} />
            <FeatureItem title="Find gif for free" imageSrc={findGifUrl} />
            <FeatureItem title="Free for everyone" imageSrc={freeGifUrl} />
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
