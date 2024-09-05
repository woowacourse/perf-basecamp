import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import { HeroOriginal, HeroDesktop, HeroMobile } from '../../assets/images/hero';
import { Trending, Find, Free } from '../../assets/images/video';

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
            type="image/webp"
            src={HeroOriginal}
            srcSet={`${HeroMobile} 768w, ${HeroDesktop} 1440w, ${HeroOriginal} 4100w`}
            sizes="(max-width:768px) 100vw, (max-width:1440px) 100vw, 100vw"
          />
          <img className={styles.heroImage} src={HeroOriginal} alt="hero image" />
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
            <FeatureItem title="See trending gif" imageSrc={Trending} />
            <FeatureItem title="Find gif for free" imageSrc={Find} />
            <FeatureItem title="Free for everyone" imageSrc={Free} />
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
