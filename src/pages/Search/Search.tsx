import { KeyboardEvent, lazy, Suspense } from 'react';
import useGifSearch from './hooks/useGifSearch';

const SearchBar = lazy(() => import('./components/SearchBar/SearchBar'));
const SearchResult = lazy(() => import('./components/SearchResult/SearchResult'));

import styles from './Search.module.css';
import HelpPanel from './components/HelpPanel/HelpPanel';

const Search = () => {
  const { status, searchKeyword, gifList, searchByKeyword, updateSearchKeyword, loadMore } =
    useGifSearch();

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchByKeyword();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchBar
          searchKeyword={searchKeyword}
          onEnter={handleEnter}
          onChange={updateSearchKeyword}
          onSearch={searchByKeyword}
        />
      </Suspense>
      <Suspense>
        <SearchResult status={status} gifList={gifList} loadMore={loadMore} />
      </Suspense>
      <HelpPanel />
    </div>
  );
};

export default Search;
