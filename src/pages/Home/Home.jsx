import React from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import FeatureItem from "../../components/FeatureItem/FeatureItem";

import heroImage from "../../assets/images/hero.webp";
import trendingGif from "../../assets/images/trending.gif";
import findGif from "../../assets/images/find.gif";

import styles from "./Home.module.css";

const Home = () => {
  return (
    <>
      <NavBar />
      <section className={styles.heroSection}>
        <img className={styles.heroImage} src={heroImage} alt="hero" />
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
