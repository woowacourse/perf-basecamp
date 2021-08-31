import FeatureItem from '../../components/FeatureItem/FeatureItem';
import Footer from '../../components/Footer/Footer';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar';
import React from 'react';
import findMp4 from '../../assets/images/find.mp4';
import findWebm from '../../assets/images/find.webm';
import heroImage from '../../assets/images/hero.png';
import heroImageWebP from '../../assets/images/hero.webp';
import heroSmallWebP from '../../assets/images/herosmall.webp';
import styles from './Home.module.css';
import trendingMp4 from '../../assets/images/trending.mp4';
import trendingWebm from '../../assets/images/trending.webm';

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
            <FeatureItem
              title="See trending gif"
              imageSrc={{
                mp4: trendingMp4,
                webm: trendingWebm,
              }}
            />
            <FeatureItem
              title="Find gif for free"
              imageSrc={{ mp4: findMp4, webm: findWebm }}
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;
