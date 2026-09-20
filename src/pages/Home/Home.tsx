import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImage from '../../assets/images/hero.png?webp';
import heroFallback from '../../assets/images/hero.png';
import trendingMp4 from '../../assets/images/trending.mp4';
import findMp4 from '../../assets/images/find.mp4';
import freeMp4 from '../../assets/images/free.mp4';

import ResponsiveImage from '../../components/ResponsiveImage/ResponsiveImage';
import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const cx = classNames.bind(styles);

const INDEX = [
  {
    title: 'See trending gif',
    type: 'mp4',
    src: trendingMp4
  },
  {
    title: 'Find gif for free',
    type: 'mp4',
    src: findMp4
  },
  {
    title: 'Free for everyone',
    type: 'mp4',
    src: freeMp4
  }
] as const;

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <ResponsiveImage
          image={heroImage}
          fallback={heroFallback}
          className={styles.heroImage}
          alt="hero image"
        />
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
            {INDEX.map(({ title, type, src }) => (
              <FeatureItem key={title} title={title} type={type} src={src} />
            ))}
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
