import React from "react";
import { Link } from "react-router-dom";

import FeatureItem from "../../components/FeatureItem/FeatureItem";

import heroImage from "../../assets/images/hero.webp";
import trendingMP4 from "../../assets/images/trending.mp4";
import findMP4 from "../../assets/images/find.mp4";

import styles from "./Home.module.css";
import { SearchLoadable } from "../Loadable";

const Home = () => {
  return (
    <>
      <section className={styles.heroSection}>
        <img className={styles.heroImage} src={heroImage} alt="hero" />
        <div className={styles.projectTitle}>
          <h1 className={styles.title}>Memegle</h1>
          <h3 className={styles.subtitle}>gif search engine for you</h3>
        </div>
        <Link to="/search" onMouseEnter={() => SearchLoadable.preload()}>
          <button className={styles.cta}>start search</button>
        </Link>
      </section>
      <section className={styles.featureSection}>
        <div className={styles.featureSectionWrapper}>
          <h2 className={styles.featureTitle}>Features</h2>
          <div className={styles.featureItemContainer}>
            <FeatureItem title="See trending gif" videoSrc={trendingMP4} />
            <FeatureItem title="Find gif for free" videoSrc={findMP4} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
