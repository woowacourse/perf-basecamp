import React from 'react';
import { Link } from 'react-router-dom';

import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import FeatureItem from '../../components/FeatureItem/FeatureItem';

import trendingGif from '../../assets/images/trending.gif';
import findGif from '../../assets/images/find.gif';
import styles from './Home.module.css';

import heroMobileImage from '../../assets/images/hero-375w.webp';
import heroTabletImage from '../../assets/images/hero-768w.webp';
import heroDesktopImage from '../../assets/images/hero-1980w.webp';
import heroFallbackImage from '../../assets/images/hero-fallback.png';

const Home = () => {
  console.log('heroDesktopImage', heroDesktopImage);

  return (
    <>
      <NavBar />
      <section className={styles.heroSection}>
        <picture>
          <source
            type="image/webp"
            src={heroDesktopImage}
            srcSet={`
              ${heroMobileImage} 375w,
              ${heroTabletImage} 768w,
              ${heroDesktopImage} 1980w,
            `}
            sizes="(max-width: 375px) 50vw, (max-width: 768px) 75vw, 100vw"
          />
          <img
            className={styles.heroImage}
            src={heroFallbackImage}
            alt="hero"
          />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to="/search">
          <button className={styles.cta}>start search</button>
        </Link>
      </section>
      <section className={styles.featureSection}>
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem title="See trending gif" imageSrc={trendingGif} />
            <FeatureItem title="Find gif for free" imageSrc={findGif} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
