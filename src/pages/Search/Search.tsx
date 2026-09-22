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
    gifList,
    isTrendingLoading,
    searchByKeyword,
    updateSearchKeyword,
    loadMore
  } = useGifSearch();

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchByKeyword();
    }
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
        gifList={gifList}
        isTrendingLoading={isTrendingLoading}
        loadMore={loadMore}
      />
      <HelpPanel />
    </div>
  );
};

export default Search;
