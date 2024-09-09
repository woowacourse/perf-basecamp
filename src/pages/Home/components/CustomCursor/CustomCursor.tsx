import { ChangeEvent, useEffect, useState } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';
import { gifAPIService } from '../../../../apis/gifAPIService';

const DEFAULT_PAGE_INDEX = 0;
const TRENDING_CACHE_KEY = 'trendingGifs';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

export const SEARCH_STATUS = {
  BEFORE_SEARCH: 'BEFORE_SEARCH',
  LOADING: 'LOADING',
  FOUND: 'FOUND',
  NO_RESULT: 'NO_RESULT',
  ERROR: 'ERROR'
} as const;

export type SearchStatus = typeof SEARCH_STATUS[keyof typeof SEARCH_STATUS];

const useGifSearch = () => {
  const [status, setStatus] = useState<SearchStatus>(SEARCH_STATUS.BEFORE_SEARCH);
  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [gifList, setGifList] = useState<GifImageModel[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateSearchKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const resetSearch = () => {
    setStatus(SEARCH_STATUS.LOADING);
    setCurrentPageIndex(DEFAULT_PAGE_INDEX);
    setGifList([]);
    setErrorMessage(null);
  };

  const handleError = (error: unknown) => {
    setStatus(SEARCH_STATUS.ERROR);
    setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
  };

  const searchByKeyword = async (): Promise<void> => {
    resetSearch();

    try {
      const gifs = await gifAPIService.searchByKeyword(searchKeyword, DEFAULT_PAGE_INDEX);

      if (gifs.length === 0) {
        setStatus(SEARCH_STATUS.NO_RESULT);
        return;
      }

      setGifList(gifs);
      setStatus(SEARCH_STATUS.FOUND);
    } catch (error) {
      handleError(error);
    }
  };

  const loadMore = async (): Promise<void> => {
    const nextPageIndex = currentPageIndex + 1;

    try {
      const newGifList = await gifAPIService.searchByKeyword(searchKeyword, nextPageIndex);

      setGifList((prevGifList) => [...prevGifList, ...newGifList]);
      setCurrentPageIndex(nextPageIndex);
    } catch (error) {
      handleError(error);
    }
  };

  const getCachedTrending = (): GifImageModel[] | null => {
    const cachedData = localStorage.getItem(TRENDING_CACHE_KEY);
    if (!cachedData) return null;

    const { timestamp, gifs } = JSON.parse(cachedData);
    if (Date.now() - timestamp > CACHE_EXPIRATION) {
      localStorage.removeItem(TRENDING_CACHE_KEY);
      return null;
    }

    return gifs;
  };

  const setCachedTrending = (gifs: GifImageModel[]): void => {
    const cacheData = JSON.stringify({
      timestamp: Date.now(),
      gifs
    });
    localStorage.setItem(TRENDING_CACHE_KEY, cacheData);
  };

  useEffect(() => {
    const fetchTrending = async () => {
      if (status !== SEARCH_STATUS.BEFORE_SEARCH) return;

      try {
        const cachedGifs = getCachedTrending();
        if (cachedGifs) {
          setGifList(cachedGifs);
          return;
        }

        const gifs = await gifAPIService.getTrending();
        setGifList(gifs);
        setCachedTrending(gifs);
      } catch (error) {
        handleError(error);
      }
    };

    fetchTrending();
  }, []);

  return {
    status,
    searchKeyword,
    gifList,
    errorMessage,
    searchByKeyword,
    updateSearchKeyword,
    loadMore
  } as const;
};

export default useGifSearch;
