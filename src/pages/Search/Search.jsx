import React, { useState, useEffect } from "react";
import { MdSearch } from "@react-icons/all-files/md/MdSearch";

import { fetchTrendingGifs, fetchGifsByKeyword } from "../../service/fetchGif";

import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import GifItem from "../../components/GifItem/GifItem";

import styles from "./Search.module.css";

const DEFAULT_PAGE_INDEX = 0;

const ResultTitle = ({ showTrending, noResult }) => {
  if (noResult) {
    return (
      <h2 className={styles.resultTitle}>
        <span>Nothing</span>🥲
      </h2>
    );
  }

  if (showTrending) {
    return (
      <h2 className={styles.resultTitle}>
        🔥 <span>Trending Now</span> 🔥
      </h2>
    );
  }

  return (
    <h2 className={styles.resultTitle}>
      <span>We Found...</span>
    </h2>
  );
};

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [showTrending, setShowTrending] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const showLoadMoreButton = !showTrending && !noResult;

  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [gifList, setGifList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

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

    setGifList((prev) => {
      const dict = new Set(prev.map(({ id }) => id));

      return [...prev, ...gifs.filter(({ id }) => !dict.has(id))];
    });
    setCurrentPageIndex(nextPageIndex);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    searchByKeyword();
  };

  const handleChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    searchByKeyword();
  };

  useEffect(() => {
    let didCancel = false;

    if (loading) {
      fetchTrendingGifs().then((gifs) => {
        if (!didCancel) {
          setGifList(gifs);
          setLoading(false);
        }
      });
    }

    return () => {
      didCancel = true;
    };
  }, [loading]);

  return (
    <>
      <NavBar />
      <div className={styles.searchContainer}>
        <section className={styles.searchbarSection}>
          <label htmlFor="search-input" className={styles.searchbarTitle}>
            <h1>- find the best gif now -</h1>
          </label>
          <form className={styles.searchbarContainer} onSubmit={handleSubmit}>
            <input
              id="search-input"
              className={styles.searchInput}
              type="text"
              value={searchKeyword}
              onKeyPress={handleEnter}
              onChange={handleChange}
            />
            <button
              className={styles.searchButton}
              type="button"
              aria-label="아이콘 검색"
            >
              <MdSearch color="white" size="2rem" />
            </button>
          </form>
        </section>
        <section className={styles.searchResultSection}>
          <ResultTitle showTrending={showTrending} noResult={noResult} />
          <div className={styles.gifResultWrapper}>
            {gifList.map((gif) => (
              <GifItem key={gif.id} title={gif.title} mp4Url={gif.mp4Url} />
            ))}
          </div>
          {showLoadMoreButton && (
            <button
              type="button"
              className={styles.loadMoreButton}
              onClick={loadMore}
            >
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
