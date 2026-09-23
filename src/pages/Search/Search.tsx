import useGifSearch from './hooks/useGifSearch';

import SearchBar from './components/SearchBar/SearchBar';
import SearchResult from './components/SearchResult/SearchResult';
import HelpPanel from './components/HelpPanel/HelpPanel';

import styles from './Search.module.css';

const Search = () => {
  const { status, gifList, searchByKeyword, loadMore } = useGifSearch();

  return (
    <div className={styles.searchContainer}>
      <SearchBar onSearch={searchByKeyword} />
      <SearchResult status={status} gifList={gifList} loadMore={loadMore} />
      <HelpPanel />
    </div>
  );
};

export default Search;
