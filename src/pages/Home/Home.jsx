import React from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import FeatureItem from "../../components/FeatureItem/FeatureItem";

import heroImage640 from "../../assets/images/hero-640.webp";
import heroImage768 from "../../assets/images/hero-768.webp";
import heroImage1024 from "../../assets/images/hero-1024.webp";
import heroImage1280 from "../../assets/images/hero-1280.webp";
import heroImage1536 from "../../assets/images/hero-1536.webp";

import trendingWebM from "../../assets/images/trending.webm";
import findWebm from "../../assets/images/find.webm";

import styles from "./Home.module.css";

const Home = () => (
  <>
    <NavBar />
    <section className={styles.heroSection}>
      <img
        className={styles.heroImage}
        src={heroImage1536}
        srcSet={`
          ${heroImage640} 640w,
          ${heroImage768} 768w,
          ${heroImage1024} 1024w,
          ${heroImage1280} 1280w,
          ${heroImage1536} 1536w
        `}
        sizes="100vw"
        alt="hero"
      />
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
