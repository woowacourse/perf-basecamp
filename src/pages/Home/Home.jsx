import React from 'react';
import { Link } from 'react-router-dom';

import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import FeatureItem from '../../components/FeatureItem/FeatureItem';

import heroImage768 from '../../assets/images/hero-768.webp';
import heroImage1024 from '../../assets/images/hero-1024.webp';
import heroImage1600 from '../../assets/images/hero-1600.webp';
import trendingMp4 from '../../assets/images/trending.mp4';
import findMp4 from '../../assets/images/find.mp4';

import styles from './Home.module.css';

const Home = () => {
  return (
    <>
      <NavBar />
      <section className={styles.heroSection}>
        <img
          className={styles.heroImage}
          srcset={`${heroImage768} 768w, ${heroImage1024} 1024w, ${heroImage1600} 1600w`}
          sizes="(max-width: 768px) 768px, (max-width: 1024px) 1024px, 100vw"
          alt="hero"
        />
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
            <FeatureItem title="See trending gif" videoSrc={trendingMp4} />
            <FeatureItem title="Find gif for free" videoSrc={findMp4} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
