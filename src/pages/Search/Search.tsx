import { KeyboardEvent, useRef } from 'react';
import useGifSearch from './hooks/useGifSearch';

import SearchBar from './components/SearchBar/SearchBar';
import SearchResult from './components/SearchResult/SearchResult';
import HelpPanel from './components/HelpPanel/HelpPanel';

import styles from './Search.module.css';

const Search = () => {
  const { status, gifList, searchByKeyword, loadMore } = useGifSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current) return;
    if (e.key !== 'Enter') return;

    const value = inputRef.current.value;
    searchByKeyword(value);
  };

  const handleSearch = () => {
    if (!inputRef.current) return;

    const value = inputRef.current.value;
    searchByKeyword(value);
  };

  const handleLoadMore = () => {
    if (!inputRef.current) return;

    const value = inputRef.current.value;
    loadMore(value);
  };

  return (
    <div className={styles.searchContainer}>
      <SearchBar onEnter={handleEnter} onSearch={handleSearch} ref={inputRef} />
      <SearchResult status={status} gifList={gifList} onLoadMore={handleLoadMore} />
      <HelpPanel />
    </div>
  );
};

export default Search;
