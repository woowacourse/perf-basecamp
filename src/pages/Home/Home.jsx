import React from "react";
import { Link } from "react-router-dom";

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import FeatureItem from "../../components/FeatureItem/FeatureItem";

import heroPng424 from "../../assets/images/hero_424px.png";
import heroPng1792 from "../../assets/images/hero_1792px.png";
import heroPng4100 from "../../assets/images/hero_4100px.png";
import trendingGif from "../../assets/images/trending.gif";
import findGif from "../../assets/images/find.gif";

import styles from "./Home.module.css";

const Home = () => {
  return (
    <>
      <NavBar />
      <section className={styles.heroSection}>
        <picture>
          <source
            type="image/webp"
            srcSet={heroPng424 + ".webp"}
            media="(max-width: 424px)"
          />
          <source
            type="image/webp"
            srcSet={heroPng1792 + ".webp"}
            media="(max-width: 1792px)"
          />
          <source type="image/webp" srcSet={heroPng4100 + ".webp"} />
          <source
            type="image/png"
            srcSet={heroPng424}
            media="(max-width: 424px)"
          />
          <source
            type="image/png"
            srcSet={heroPng1792}
            media="(max-width: 1792px)"
          />
          <source type="image/png" srcSet={heroPng4100} />
          <img className={styles.heroImage} src={heroPng4100} alt="hero" />
        </picture>
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
          <h4 className={styles.featureTitle}>Features</h4>
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
