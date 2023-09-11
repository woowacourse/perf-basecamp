import { KeyboardEvent } from 'react';
import useGifSearch from './hooks/useGifSearch';

import SearchBar from './components/SearchBar/SearchBar';
import SearchResult from './components/SearchResult/SearchResult';
import HelpPanel from './components/HelpPanel/HelpPanel';

import styles from './Search.module.css';

const Search = () => {
  const {
    status,
    searchKeyword,
    trendingGifList,
    gifList,
    searchByKeyword,
    updateSearchKeyword,
    loadMore
  } = useGifSearch();

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }

    searchByKeyword();
  };

  return (
    <div className={styles.searchContainer}>
      <SearchBar
        searchKeyword={searchKeyword}
        onEnter={handleEnter}
        onChange={updateSearchKeyword}
        onSearch={searchByKeyword}
      />
      <SearchResult
        status={status}
        gifList={status === 'BEFORE_SEARCH' ? trendingGifList : gifList}
        loadMore={loadMore}
      />
      <HelpPanel />
    </div>
  );
};

export default Search;
