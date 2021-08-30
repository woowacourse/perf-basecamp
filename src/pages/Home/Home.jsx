import FeatureItem from '../../components/FeatureItem/FeatureItem';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import React from 'react';
import findGif from '../../assets/images/find.gif';
import heroImage from '../../assets/images/hero.png';
import heroImageWebp from '../../assets/webp/hero.webp';
import styles from './Home.module.css';
import trendingGif from '../../assets/images/trending.gif';

const Home = () => {
  return (
    <>
      <NavBar />
      <section className={styles.heroSection}>
        <picture>
          <source type='image/webp' src={heroImageWebp} />
          <img className={styles.heroImage} src={heroImage} alt='hero' />
        </picture>
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to='/search'>
          <button className={styles.cta}>start search</button>
        </Link>
      </section>
      <section className={styles.featureSection}>
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem title='See trending gif' imageSrc={trendingGif} />
            <FeatureItem title='Find gif for free' imageSrc={findGif} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
