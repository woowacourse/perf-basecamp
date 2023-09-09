import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { gifAPIService } from '../../../apis/gifAPIService';
import { GifImageModel } from '../../../models/image/gifImage';

const DEFAULT_PAGE_INDEX = 0;

export const SEARCH_STATUS = {
  BEFORE_SEARCH: 'BEFORE_SEARCH',
  LOADING: 'LOADING',
  FOUND: 'FOUND',
  NO_RESULT: 'NO_RESULT',
} as const;

export type SearchStatus = (typeof SEARCH_STATUS)[keyof typeof SEARCH_STATUS];

const useGifSearch = () => {
  const [status, setStatus] = useState<SearchStatus>(SEARCH_STATUS.BEFORE_SEARCH);
  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [gifList, setGifList] = useState<GifImageModel[]>([]);
  const searchKeywordRef = useRef('');

  const updateSearchKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    searchKeywordRef.current = e.currentTarget.value;
  }, []);

  const resetSearch = () => {
    setStatus(SEARCH_STATUS.LOADING);
    setCurrentPageIndex(DEFAULT_PAGE_INDEX);
  };

  const searchByKeyword = useCallback(async () => {
    resetSearch();

    const gifs: GifImageModel[] = await gifAPIService.searchByKeyword(
      searchKeywordRef.current,
      DEFAULT_PAGE_INDEX,
    );

    if (gifs.length === 0) {
      setStatus(SEARCH_STATUS.NO_RESULT);
      return;
    }

    setGifList(gifs);
    setStatus(SEARCH_STATUS.FOUND);
  }, []);

  const loadMore = async () => {
    const nextPageIndex = currentPageIndex + 1;
    const gifs: GifImageModel[] = await gifAPIService.searchByKeyword(
      searchKeywordRef.current,
      nextPageIndex,
    );

    setGifList([...gifList, ...gifs]);
    setCurrentPageIndex(nextPageIndex);
  };

  useEffect(() => {
    const fetch = async () => {
      if (status !== SEARCH_STATUS.BEFORE_SEARCH) return;

      const gifs: GifImageModel[] = await gifAPIService.getTrending();
      setGifList(gifs);
    };

    fetch();

    return () => setStatus(SEARCH_STATUS.LOADING);
  }, []);

  return {
    status,
    gifList,
    searchByKeyword,
    updateSearchKeyword,
    loadMore,
  } as const;
};

export default useGifSearch;
