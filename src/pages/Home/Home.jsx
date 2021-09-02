import React from 'react';
import { Link } from 'react-router-dom';

import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import FeatureItem from '../../components/FeatureItem/FeatureItem';

import heroImage from '../../assets/images/hero.webp';
import heroImageSmall from '../../assets/images/hero_w_768.webp';

import trendingGif from '../../assets/images/trending.webm';
import findGif from '../../assets/images/find.webm';

import styles from './Home.module.css';

const Home = () => {
  return (
    <>
      <NavBar />
      <section className={styles.heroSection}>
        <img
          className={styles.heroImage}
          sizes="(max-width: 2560px) 100vw, 2560px"
          srcSet={`
            ${heroImage} 424w,
            ${heroImageSmall} 768w,
            ${heroImage} 1600w,
          `}
          src={heroImage}
          alt="hero"
        />
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h2 className={styles.subtitle}>gif search engine for you</h2>
        </div>
        <Link to="/search">
          <button className={styles.cta}>start search</button>
        </Link>
      </section>
      <section className={styles.featureSection}>
        <div className={styles.featureSectionWrapper}>
          <h3 className={styles.featureTitle}>Features</h3>
          <div className={styles.featureItemContainer}>
            <FeatureItem title="See trending gif" url={trendingGif} />
            <FeatureItem title="Find gif for free" url={findGif} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
