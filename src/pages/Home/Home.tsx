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

  const heroImageUrl = `${process.env.IMAGE_URL}/hero`;
  const getHeroImageUrl = (size: 480 | 768 | 1024 | 1920 | 'original', format: 'avif' | 'webp') => {
    return `${heroImageUrl}_${size}.${format}`;
  };

  const heroImageAvif = `${heroImageUrl}.avif`;
  const trendingGifUrl = `${process.env.IMAGE_URL}/trending.mp4`;
  const findGifUrl = `${process.env.IMAGE_URL}/find.mp4`;
  const freeGifUrl = `${process.env.IMAGE_URL}/free.mp4`;

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source
            srcSet={`
              ${getHeroImageUrl(480, 'avif')} 480w, 
              ${getHeroImageUrl(768, 'avif')} 768w, 
              ${getHeroImageUrl(1024, 'avif')}  1024w, 
              ${getHeroImageUrl(1920, 'avif')}  1920w,
              ${getHeroImageUrl('original', 'avif')} 2560w
            `}
            type="image/avif"
          />

          <source
            srcSet={`
              ${getHeroImageUrl(480, 'webp')} 480w, 
              ${getHeroImageUrl(768, 'webp')} 768w, 
              ${getHeroImageUrl(1024, 'webp')}  1024w, 
              ${getHeroImageUrl(1920, 'webp')}  1920w,
              ${getHeroImageUrl('original', 'webp')} 2560w
            `}
            type="image/webp"
          />

          <img
            fetchPriority="high"
            className={styles.heroImage}
            src={`${heroImageAvif}_original.webp`}
            alt="hero image"
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
