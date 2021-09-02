import React from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import FeatureItem from "../../components/FeatureItem/FeatureItem";

import heroImage640 from "../../assets/images/hero-640.webp";
import heroImage1280 from "../../assets/images/hero-1280.webp";
import heroImage1920 from "../../assets/images/hero-1920.webp";

import trendingWebM from "../../assets/images/trending.webm";
import findWebm from "../../assets/images/find.webm";

import styles from "./Home.module.css";

const Home = () => (
  <>
    <NavBar />
    <section className={styles.heroSection}>
      <picture>
        <source
          className={styles.heroImage}
          src={heroImage1920}
          srcSet={`
          ${heroImage640} 640w,
          ${heroImage1280} 1024w,          
          ${heroImage1920} 1536w
        `}
          sizes="100vw"
          alt="hero"
        />
        <img className={styles.heroImage} src={heroImage1920} alt="hero" />
      </picture>
      <div className={styles.projectTitle}>
        <h1 className={styles.title}>Memegle</h1>
        <h2 className={styles.subtitle}>gif search engine for you</h2>
      </div>
      <Link to="/search">
        <button type="button" className={styles.cta}>
          start search
        </button>
      </Link>
    </section>
    <section className={styles.featureSection}>
      <div className={styles.featureSectionWrapper}>
        <h2 className={styles.featureTitle}>Features</h2>
        <div className={styles.featureItemContainer}>
          <FeatureItem title="See trending gif" videoSrc={trendingWebM} />
          <FeatureItem title="Find gif for free" videoSrc={findWebm} />
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default Home;
