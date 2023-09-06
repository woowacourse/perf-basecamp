import { Link } from 'react-router-dom';

import styles from './NavBar.module.css';
import { ROUTE_PATH } from '../../constants/pageRoute';
import { memo } from 'react';

const NavBar = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to={ROUTE_PATH.MAIN_PAGE}>
          <span className={styles.logo}>memegle</span>
        </Link>
        <Link to={ROUTE_PATH.SEARCH_PAGE}>
          <button className={styles.searchPageButton}>start search</button>
        </Link>
      </nav>
    </header>
  );
};

export default memo(NavBar);
