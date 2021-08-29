import React from 'react';
import { Link } from 'react-router-dom';

import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import FeatureItem from '../../components/FeatureItem/FeatureItem';

import heroImageS from '../../assets/images/hero_w_768.webp';
import heroImageM from '../../assets/images/hero_w_1381.webp';
import heroImageL from '../../assets/images/hero_w_2037.webp';
import heroImageXL from '../../assets/images/hero_w_2560.webp';

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
            ${heroImageL} 424w,
            ${heroImageS} 768w,
            ${heroImageM} 1381w,
            ${heroImageL} 2037w,
            ${heroImageXL} 2560w
          `}
          src={heroImageXL}
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
