import { useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

// hero
import heroImage from '../../assets/images/hero.png';
import heroWebp from '../../assets/images/hero.webp';

// free
import freeMP4 from '../../assets/images/free.mp4';
import freeWebm from '../../assets/images/free.webm';

// find
import findMP4 from '../../assets/images/find.mp4';
import findWebm from '../../assets/images/find.webm';

// trending
import trendingMP4 from '../../assets/images/trending.mp4';
import trendingWebm from '../../assets/images/trending.webm';

// import FeatureItem from './components/FeatureItem/FeatureItem';
import CustomCursor from './components/CustomCursor/CustomCursor';
import AnimatedPath from './components/AnimatedPath/AnimatedPath';

import styles from './Home.module.css';

const Home = () => {
  const wrapperRef = useRef<HTMLElement>(null);

  return (
    <>
      <section className={styles.heroSection}>
        <picture>
          <source className={styles.heroImage} type="image/webp" srcSet={heroWebp} />
          <source className={styles.heroImage} type="image/png" srcSet={heroImage} />
          <img className={styles.heroImage} src={heroImage}></img>
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
            {/* trending */}
            <div className={styles.featureItem}>
              <video className={styles.featureImage} autoPlay loop muted playsInline>
                <source src={trendingWebm} type="video/webm" />
                <source src={trendingMP4} type="video/mp4" />
              </video>
              <div className={styles.featureTitleBg}></div>
              <h4 className={styles.featureTitle}>See trending gif</h4>
            </div>

            {/* find video */}
            <div className={styles.featureItem}>
              <video className={styles.featureImage} autoPlay loop muted playsInline>
                <source src={findWebm} type="video/webm" />
                <source src={findMP4} type="video/mp4" />
              </video>
              <div className={styles.featureTitleBg}></div>
              <h4 className={styles.featureTitle}>Find gif for fre</h4>
            </div>

            {/* free */}
            <div className={styles.featureItem}>
              <video className={styles.featureImage} autoPlay loop muted playsInline>
                <source src={freeWebm} type="video/webm" />
                <source src={freeMP4} type="video/mp4" />
              </video>
              <div className={styles.featureTitleBg}></div>
              <h4 className={styles.featureTitle}>Free for everyonee</h4>
            </div>
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
