import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import heroImageAvifPC from '../../assets/images/hero.png?as=avif-pc';
import heroImageAvifTablet from '../../assets/images/hero.png?as=avif-tablet';
import heroImageAvifMobile from '../../assets/images/hero.png?as=avif-mobile';
import heroImageWebpPC from '../../assets/images/hero.png?as=webp-pc';
import heroImageWebpTablet from '../../assets/images/hero.png?as=webp-tablet';
import heroImageWebpMobile from '../../assets/images/hero.png?as=webp-mobile';
import heroImagePng from '../../assets/images/hero.png';
import trendingWebm from '../../assets/videos/trending.webm';
import trendingMp4 from '../../assets/videos/trending.mp4';
import findWebm from '../../assets/videos/find.webm';
import findMp4 from '../../assets/videos/find.mp4';
import freeWebm from '../../assets/videos/free.webm';
import freeMp4 from '../../assets/videos/free.mp4';

import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';
import ResponsivePicture from '../../components/ResponsivePicture/ResponsivePicture';

const cx = classNames.bind(styles);

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <ResponsivePicture
          sources={[
            { src: heroImageAvifPC, format: 'avif', device: 'pc' },
            { src: heroImageWebpPC, format: 'webp', device: 'pc' },
            { src: heroImageAvifTablet, format: 'avif', device: 'tablet' },
            { src: heroImageWebpTablet, format: 'webp', device: 'tablet' },
            { src: heroImageAvifMobile, format: 'avif', device: 'mobile' },
            { src: heroImageWebpMobile, format: 'webp', device: 'mobile' }
          ]}
        >
          <img className={styles.heroImage} src={heroImagePng} alt="Hero image" />
        </ResponsivePicture>
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
            <FeatureItem
              title="See trending gif"
              videoList={[
                { format: 'webm', src: trendingWebm },
                { format: 'mp4', src: trendingMp4 }
              ]}
            />
            <FeatureItem
              title="Find gif for free"
              videoList={[
                { format: 'webm', src: findWebm },
                { format: 'mp4', src: findMp4 }
              ]}
            />
            <FeatureItem
              title="Free for everyone"
              videoList={[
                { format: 'webm', src: freeWebm },
                { format: 'mp4', src: freeMp4 }
              ]}
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
