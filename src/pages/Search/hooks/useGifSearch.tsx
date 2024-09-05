import { ChangeEvent, useEffect, useState } from 'react';
import { gifAPIService } from '../../../apis/gifAPIService';
import { GifImageModel } from '../../../models/image/gifImage';

const DEFAULT_PAGE_INDEX = 0;
const TRENDING_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const TRENDING_CACHE_KEY = 'trendingGifs';

export const SEARCH_STATUS = {
  BEFORE_SEARCH: 'BEFORE_SEARCH',
  LOADING: 'LOADING',
  FOUND: 'FOUND',
  NO_RESULT: 'NO_RESULT',
  ERROR: 'ERROR'
} as const;

export type SearchStatus = (typeof SEARCH_STATUS)[keyof typeof SEARCH_STATUS];

interface CachedData {
  gifs: GifImageModel[];
  timestamp: number;
}

const getTrendingCache = (): GifImageModel[] | null => {
  const storedData = localStorage.getItem(TRENDING_CACHE_KEY);
  if (storedData) {
    const { gifs, timestamp } = JSON.parse(storedData) as CachedData;
    if (Date.now() - timestamp < TRENDING_CACHE_EXPIRY) {
      return gifs;
    }
  }
  return null;
};

const setTrendingCache = (gifs: GifImageModel[]) => {
  const cacheData: CachedData = {
    gifs,
    timestamp: Date.now()
  };
  localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify(cacheData));
};

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

  const fetchTrendingGifs = async () => {
    const cachedGifs = getTrendingCache();
    if (cachedGifs) {
      setGifList(cachedGifs);
      setStatus(SEARCH_STATUS.FOUND);
      return;
    }

    setStatus(SEARCH_STATUS.LOADING);
    try {
      const gifs = await gifAPIService.getTrending();
      setGifList(gifs);
      setStatus(SEARCH_STATUS.FOUND);
      setTrendingCache(gifs);
    } catch (error) {
      handleError(error);
    }
  };

  const searchByKeyword = async (): Promise<void> => {
    if (!searchKeyword.trim()) {
      fetchTrendingGifs(); // 검색어가 비어있으면 trending GIFs를 보여줌
      return;
    }

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

  useEffect(() => {
    fetchTrendingGifs();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

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
