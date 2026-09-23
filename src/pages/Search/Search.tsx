import { KeyboardEvent } from 'react';
import useGifSearch from './hooks/useGifSearch';

import SearchBar from './components/SearchBar/SearchBar';
import SearchResult from './components/SearchResult/SearchResult';
import HelpPanel from './components/HelpPanel/HelpPanel';

import styles from './Search.module.css';

const Search = (): JSX.Element => {
  const { status, searchKeyword, gifList, searchByKeyword, updateSearchKeyword, loadMore } =
    useGifSearch();

  const handleEnter = async (e: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === 'Enter') {
      await searchByKeyword();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <SearchBar
        searchKeyword={searchKeyword}
        onEnter={(e) => {
          void handleEnter(e);
        }}
        onChange={updateSearchKeyword}
        onSearch={() => {
          void searchByKeyword();
        }}
      />
      <SearchResult
        status={status}
        gifList={gifList}
        loadMore={() => {
          void loadMore();
        }}
      />
      <HelpPanel />
    </div>
  );
};

export default Search;
