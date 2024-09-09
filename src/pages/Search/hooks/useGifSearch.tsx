import { ChangeEvent, useEffect, useState } from 'react';

import { gifAPIService } from '../../../apis/gifAPIService';
import { GifImageModel } from '../../../models/image/gifImage';
import CacheService from '@utils/cacheService';

const DEFAULT_PAGE_INDEX = 0;
const CACHE_KEY = 'trending-gifs';

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

  const cacheService = new CacheService({ cacheName: CACHE_KEY });

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
      const newGitList = await gifAPIService.searchByKeyword(searchKeyword, nextPageIndex);

      setGifList((prevGifList) => [...prevGifList, ...newGitList]);
      setCurrentPageIndex(nextPageIndex);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const fetchTrending = async () => {
      if (status !== SEARCH_STATUS.BEFORE_SEARCH) return;

      try {
        const cachedGifs = await cacheService.get<GifImageModel[]>(CACHE_KEY);
        if (cachedGifs) {
          setGifList(cachedGifs);
          return;
        }

        const gifs = await gifAPIService.getTrending();
        setGifList(gifs);

        await cacheService.set(CACHE_KEY, gifs);
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
