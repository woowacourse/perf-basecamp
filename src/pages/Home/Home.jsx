import React from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import FeatureItem from "../../components/FeatureItem/FeatureItem";

import heroImageSm from "../../assets/images/hero-sm.jpg";
import heroImageMd from "../../assets/images/hero-md.jpg";
import heroImageLg from "../../assets/images/hero-lg.jpg";
import heroImageXl from "../../assets/images/hero-xl.jpg";
import heroImage2Xl from "../../assets/images/hero-2xl.jpg";

import trendingMp4 from "../../assets/images/trending.mp4";
import trendingWebm from "../../assets/images/trending.webm";
import findMp4 from "../../assets/images/find.mp4";
import findWebm from "../../assets/images/find.webm";

import styles from "./Home.module.css";

const Home = () => (
  <>
    <NavBar />
    <section className={styles.heroSection}>
      <img
        className={styles.heroImage}
        src={heroImage2Xl}
        srcSet={`
          ${heroImageSm} 640w,
          ${heroImageMd} 768x,
          ${heroImageLg} 1024w,
          ${heroImageXl} 1280w,
          ${heroImage2Xl} 1536w
        `}
        sizes="100vw"
        alt="hero"
      />
      <div className={styles.projectTitle}>
        <h1 className={styles.title}>Memegle</h1>
        <h3 className={styles.subtitle}>gif search engine for you</h3>
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
          <FeatureItem
            title="See trending gif"
            webmSrc={trendingWebm}
            mp4Src={trendingMp4}
          />
          <FeatureItem
            title="Find gif for free"
            webmSrc={findWebm}
            mp4Src={findMp4}
          />
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default Home;
