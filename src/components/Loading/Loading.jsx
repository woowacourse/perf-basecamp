import React from 'react'

import NavBar from "../NavBar/NavBar";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <>
      <NavBar />
      <div className={styles.loadingContainer}>
        <section className={styles.loadingSection}>
          <h3 className={styles.loadingText}>Loading...</h3>
        </section>
      </div>
    </>
  )}

export default Loading;
