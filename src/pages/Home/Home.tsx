import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import trendingWebm from '../../../public/assets/videos/trending.webm';
import findWebm from '../../../public/assets/videos/find.webm';
import freeWebm from '../../../public/assets/videos/free.webm';
import trendingMp4 from '../../../public/assets/videos/trending.mp4';
import findMp4 from '../../../public/assets/videos/find.mp4';
import freeMp4 from '../../../public/assets/videos/free.mp4';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';
import Picture from '../../components/Picture/Picture';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <Picture imageName="hero" />

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
              defaultVideoSrc={trendingWebm}
              subVideoSrc={trendingMp4}
            />
            <FeatureItem
              title="Find gif for free"
              defaultVideoSrc={findWebm}
              subVideoSrc={findMp4}
            />
            <FeatureItem
              title="Free for everyone"
              defaultVideoSrc={freeWebm}
              subVideoSrc={freeMp4}
            />
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
