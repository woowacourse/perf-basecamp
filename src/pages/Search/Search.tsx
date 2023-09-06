import { KeyboardEvent, PropsWithChildren } from 'react';
import useGifSearch from './hooks/useGifSearch';

import SearchBar from './components/SearchBar/SearchBar';

import styles from './Search.module.css';
import SearchResult from './components/SearchResult/SearchResult';

const Search = ({ children }: PropsWithChildren) => {
  const { gifList, status, loadMore, searchKeyword, searchByKeyword, updateSearchKeyword } =
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
      {gifList && <SearchResult status={status} gifList={gifList} loadMore={loadMore} />}
      {children}
    </div>
  );
};

export default Search;
