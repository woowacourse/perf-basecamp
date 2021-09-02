import React, { useState, useEffect, useRef } from 'react';
import { MdSearch } from 'react-icons/md';

import { fetchTrendingGifs, fetchGifsByKeyword } from '../../service/fetchGif';

import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer/Footer';
import GifItem from '../../components/GifItem/GifItem';

import styles from './Search.module.css';

const DEFAULT_PAGE_INDEX = 0;

const ResultTitle = ({ showTrending, noResult }) => {
  if (noResult) {
    return (
      <h4 className={styles.resultTitle}>
        <span>Noting</span>🥲
      </h4>
    );
  }

  if (showTrending) {
    return (
      <h4 className={styles.resultTitle}>
        🔥 <span>Trending Now</span> 🔥
      </h4>
    );
  }

  return (
    <h4 className={styles.resultTitle}>
      <span>We Found...</span>
    </h4>
  );
};

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [showTrending, setShowTrending] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const showLoadMoreButton = !showTrending && !noResult;

  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [gifList, setGifList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    searchByKeyword();
  };

  const handleChange = e => {
    setSearchKeyword(e.target.value);
  };

  const handleEnter = e => {
    if (e.key !== 'Enter') {
      return;
    }

    searchByKeyword();
  };

  const resetSearch = () => {
    setNoResult(false);
    setShowTrending(false);
    setCurrentPageIndex(0);
  };

  const searchByKeyword = async () => {
    resetSearch();

    const gifs = await fetchGifsByKeyword(searchKeyword, DEFAULT_PAGE_INDEX);
    setGifList(gifs);

    if (gifs.length === 0) {
      setNoResult(true);
    }
  };

  const loadMore = async () => {
    const nextPageIndex = currentPageIndex + 1;
    const gifs = await fetchGifsByKeyword(searchKeyword, nextPageIndex);

    setGifList([...gifList, ...gifs]);
    setCurrentPageIndex(nextPageIndex);
  };

  const getTrendingGifs = async () => {
    const trendingGifs = localStorage.getItem('search');

    if (!trendingGifs) {
      const gifs = await fetchTrendingGifs();
      const TTL = 1000 * 60 * 60 * 12;
      const item = {
        value: gifs,
        expire: new Date().getTime() + TTL, // 12시간뒤 만료
      };

      localStorage.setItem('search', JSON.stringify(item));

      return gifs;
    } else {
      const item = JSON.parse(trendingGifs);

      if (new Date().getTime() > item.expire) {
        localStorage.removeItem('search');
      }

      return item.value;
    }
  };

  useEffect(async () => {
    if (loading) {
      const gifs = await getTrendingGifs();

      setGifList(gifs);
      setLoading(false);
    }

    return () => setLoading(true);
  }, []);

  return (
    <>
      <NavBar />
      <div className={styles.searchContainer}>
        <section className={styles.searchbarSection}>
          <h3 className={styles.searchbarTitle}>- find the best gif now - </h3>
          <div className={styles.searchbarContainer}>
            <input
              className={styles.searchInput}
              type='text'
              value={searchKeyword}
              onKeyPress={handleEnter}
              onChange={handleChange}
            />
            <button
              className={styles.searchButton}
              type='button'
              onClick={handleSearch}
            >
              <MdSearch color='white' size='2rem' />
            </button>
          </div>
        </section>
        <section className={styles.searchResultSection}>
          <ResultTitle showTrending={showTrending} noResult={noResult} />
          <div className={styles.gifResultWrapper}>
            {gifList.map(gif => (
              <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
            ))}
          </div>
          {showLoadMoreButton && (
            <button className={styles.loadMoreButton} onClick={loadMore}>
              load more
            </button>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Search;
