import React from "react";
import { Link } from "react-router-dom";
import { SearchLoadable } from "../../pages/Loadable";

import styles from "./NavBar.module.css";

const NavBar = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/">
          <span className={styles.logo}>memegle</span>
        </Link>
        <Link to="/search" onMouseEnter={() => SearchLoadable.preload()}>
          <button className={styles.searchPageButton}>start search</button>
        </Link>
      </nav>
    </header>
  );
};

export default NavBar;
