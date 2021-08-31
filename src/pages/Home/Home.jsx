import React from 'react';
import { Link } from 'react-router-dom';

import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import FeatureItem from '../../components/FeatureItem/FeatureItem';

import heroImageMobile from '../../assets/images/hero-375.webp';
import heroImageTablet from '../../assets/images/hero-768.webp';
import heroImageFHD from '../../assets/images/hero-1980.webp';
import heroImage from '../../assets/images/hero.webp';
import trendingVideo from '../../assets/images/trending.mp4';
import findVideo from '../../assets/images/find.mp4';

import styles from './Home.module.css';

const Home = () => {
  return (
    <>
      <NavBar />
      <section className={styles.heroSection}>
        <picture>
          <img
            className={styles.heroImage}
            srcSet={`${heroImageMobile} 375w, ${heroImageTablet} 768w, ${heroImageFHD} 1980w, ${heroImage} 2500w`}
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
            <FeatureItem title="See trending gif" videoSrc={trendingVideo} />
            <FeatureItem title="Find gif for free" videoSrc={findVideo} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
