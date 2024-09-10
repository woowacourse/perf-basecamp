import { KeyboardEvent, useState, Suspense, lazy } from 'react';
import { AiOutlineInfo } from '@react-icons/all-files/ai/AiOutlineInfo';

import useGifSearch from './hooks/useGifSearch';

import SearchBar from './components/SearchBar/SearchBar';
import SearchResult from './components/SearchResult/SearchResult';

import styles from './Search.module.css';

const HelpPanel = lazy(() => import('./components/HelpPanel/HelpPanel'));

const Search = () => {
  const [isShow, setIsShow] = useState(false);
  const openSheet = () => setIsShow(true);
  const closeSheet = () => setIsShow(false);

  const { status, searchKeyword, gifList, searchByKeyword, updateSearchKeyword, loadMore } =
    useGifSearch();

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
      <SearchResult status={status} gifList={gifList} loadMore={loadMore} />
      <button type="button" className={styles.floatingButton} onClick={openSheet}>
        <AiOutlineInfo color="white" size="24px" />
      </button>

      <Suspense fallback={<div>Loading...</div>}>
        {isShow && <HelpPanel isShow={isShow} closeSheet={closeSheet} />}
      </Suspense>
    </div>
  );
};

export default Search;
