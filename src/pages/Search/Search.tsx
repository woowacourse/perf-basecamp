import { lazy, Suspense, KeyboardEvent } from 'react';
import useGifSearch from './hooks/useGifSearch';

import SearchBar from './components/SearchBar/SearchBar';
import SearchResult from './components/SearchResult/SearchResult';

import styles from './Search.module.css';

const HelpPanel = lazy(() => import('./components/HelpPanel/HelpPanel'));

const Search = () => {
  const { status, searchKeyword, gifList, searchByKeyword, updateSearchKeyword, loadMore } =
    useGifSearch();

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
      <SearchResult status={status} gifList={gifList} loadMore={loadMore} />
      <Suspense fallback={<div>로딩중</div>}>
        <HelpPanel />
      </Suspense>
    </div>
  );
};

export default Search;
