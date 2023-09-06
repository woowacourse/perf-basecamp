import { Link } from 'react-router-dom';

import styles from './NavBar.module.css';
import { ROUTE_PATH } from '../../constants/pageRoute';
import { memo } from 'react';
import usePreventSamePageNavigation from './hooks/usePreventSamePageNavigation';

const NavBar = () => {
  const { MAIN_PAGE, SEARCH_PAGE } = ROUTE_PATH;
  const { preventSamePageNavigation } = usePreventSamePageNavigation();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to={MAIN_PAGE} onClick={(e) => preventSamePageNavigation(e, MAIN_PAGE)}>
          <span className={styles.logo}>memegle</span>
        </Link>
        <Link to={SEARCH_PAGE} onClick={(e) => preventSamePageNavigation(e, SEARCH_PAGE)}>
          <button className={styles.searchPageButton}>start search</button>
        </Link>
      </nav>
    </header>
  );
};

export default memo(NavBar);
