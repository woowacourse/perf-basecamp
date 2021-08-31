import FeatureItem from '../../components/FeatureItem/FeatureItem';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import React from 'react';
import find from '../../assets/images/find.mp4';
import heroImage from '../../assets/images/hero.jpg';
import heroImageWebP from '../../assets/images/hero.webp';
import heroSmallWebP from '../../assets/images/herosmall.webp';
import styles from './Home.module.css';
import trending from '../../assets/images/trending.mp4';

const Home = () => {
  return (
    <>
      <NavBar />
      <section className={styles.heroSection}>
        <picture>
          <source
            type="image/webp"
            srcSet={heroSmallWebP}
            media="(max-width: 799px)"
          />
          <source
            type="image/webp"
            srcSet={heroImageWebP}
            media="(min-width: 800px)"
          />
          <img className={styles.heroImage} src={heroImage} alt="hero" />
        </picture>

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
            <FeatureItem title="See trending gif" imageSrc={trending} />
            <FeatureItem title="Find gif for free" imageSrc={find} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
