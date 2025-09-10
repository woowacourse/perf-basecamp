import SearchBar from '../SearchBar/SearchBar';
import SearchResult from '../SearchResult/SearchResult';

import { KeyboardEvent } from 'react';
import useGifSearch from '../../hooks/useGifSearch';

const SearchSection = () => {
  const { status, searchKeyword, gifList, searchByKeyword, updateSearchKeyword, loadMore } =
    useGifSearch();

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchByKeyword();
    }
  };

  return (
    <>
      <SearchBar
        searchKeyword={searchKeyword}
        onEnter={handleEnter}
        onChange={updateSearchKeyword}
        onSearch={searchByKeyword}
      />
      <SearchResult status={status} gifList={gifList} loadMore={loadMore} />
    </>
  );
};

export default SearchSection;
