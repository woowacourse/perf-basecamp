import SearchSection from './components/SearchSection/SearchSection';
import HelpPanel from './components/HelpPanel/HelpPanel';

import styles from './Search.module.css';

const Search = () => {
  return (
    <div className={styles.searchContainer}>
      <SearchSection />
      <HelpPanel />
    </div>
  );
};

export default Search;
