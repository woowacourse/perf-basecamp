import React from "react";
import { MdSearch } from "react-icons/md";

import GifItem from "../../components/GifItem/GifItem";

import styles from "./Search.module.css";
import useSearch from "../../hooks/useSearch";

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
  const {
    showTrending,
    noResult,
    gifList,
    searchKeyword,
    loadMore,
    searchByKeyword,
    showLoadMoreButton,
    setSearchKeyword,
  } = useSearch();

  return (
    <>
      <div className={styles.searchContainer}>
        <section className={styles.searchbarSection}>
          <h3 className={styles.searchbarTitle}>- find the best gif now - </h3>
          <form
            className={styles.searchbarContainer}
            onSubmit={(e) => {
              e.preventDefault();
              searchByKeyword();
            }}
          >
            <input
              className={styles.searchInput}
              type="text"
              value={searchKeyword}
              onChange={({ target: { value } }) => {
                setSearchKeyword(value);
              }}
            />
            <button className={styles.searchButton}>
              <MdSearch color="white" size="2rem" />
            </button>
          </form>
        </section>
        <section className={styles.searchResultSection}>
          <ResultTitle showTrending={showTrending} noResult={noResult} />
          <div className={styles.gifResultWrapper}>
            {gifList.map((gif) => (
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
    </>
  );
};

export default Search;
