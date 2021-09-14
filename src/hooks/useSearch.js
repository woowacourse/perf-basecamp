import { useEffect, useState } from "react";
import { fetchGifsByKeyword, fetchTrendingGifs } from "../api/fetchGif";

const DEFAULT_PAGE_INDEX = 0;

const cache = {};

const useSearch = () => {
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

    const gifs =
      cache[searchKeyword] ||
      (await fetchGifsByKeyword(searchKeyword, DEFAULT_PAGE_INDEX));

    setGifList(gifs);

    if (gifs.length !== 0) {
      cache[searchKeyword] = gifs;
    }

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

  useEffect(async () => {
    if (loading) {
      const gifs = await fetchTrendingGifs();

      setGifList(gifs);
      setLoading(false);
    }

    return () => setLoading(true);
  }, []);

  return {
    showTrending,
    noResult,
    gifList,
    searchKeyword,
    loadMore,
    searchByKeyword,
    showLoadMoreButton,
    setSearchKeyword,
  };
};

export default useSearch;
