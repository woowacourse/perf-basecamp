import { ChangeEvent, useEffect, useState } from 'react';

import { gifAPIService } from '../../../apis/gifAPIService';
import { GifImageModel } from '../../../types/gifImage';

const DEFAULT_PAGE_INDEX = 0;

export const SEARCH_STATUS = {
  BEFORE_SEARCH: 'BEFORE_SEARCH',
  LOADING: 'LOADING',
  FOUND: 'FOUND',
  NO_RESULT: 'NO_RESULT',
  ERROR: 'ERROR'
} as const;

export type SearchStatus = (typeof SEARCH_STATUS)[keyof typeof SEARCH_STATUS];

interface GifSearchResult {
  readonly status: SearchStatus;
  readonly searchKeyword: string;
  readonly gifList: GifImageModel[];
  readonly errorMessage: string | null;
  readonly searchByKeyword: () => Promise<void>;
  readonly updateSearchKeyword: (event: ChangeEvent<HTMLInputElement>) => void;
  readonly loadMore: () => Promise<void>;
}

const useGifSearch = (): GifSearchResult => {
  const [status, setStatus] = useState<SearchStatus>(SEARCH_STATUS.BEFORE_SEARCH);
  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [gifList, setGifList] = useState<GifImageModel[]>([]);
  const [searchKeyword, setSearchKeyword] = useState(() => {
    if (typeof document === 'undefined') return '';
    const input = document.getElementById('gif-search-input');
    // Preserve text typed into the prerendered form before hydration finishes.
    return input instanceof HTMLInputElement ? input.value : '';
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateSearchKeyword = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchKeyword(e.target.value);
  };

  const resetSearch = (): void => {
    setStatus(SEARCH_STATUS.LOADING);
    setCurrentPageIndex(DEFAULT_PAGE_INDEX);
    setGifList([]);
    setErrorMessage(null);
  };

  const handleError = (error: unknown): void => {
    setStatus(SEARCH_STATUS.ERROR);
    setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
  };

  const performSearch = async (keyword: string): Promise<void> => {
    resetSearch();

    try {
      const gifs = await gifAPIService.searchByKeyword(keyword, DEFAULT_PAGE_INDEX);

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

  const searchByKeyword = async (): Promise<void> => {
    await performSearch(searchKeyword);
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
    const input = document.getElementById('gif-search-input');
    const pendingKeyword =
      input instanceof HTMLInputElement ? input.dataset.pendingSearch : undefined;
    if (input instanceof HTMLInputElement) delete input.dataset.pendingSearch;
    document.dispatchEvent(new Event('memegle:search-hydrated'));

    // Submit exactly what was entered before hydration, including an empty query.
    if (pendingKeyword !== undefined) {
      setSearchKeyword(pendingKeyword);
      void performSearch(pendingKeyword);
      return;
    }

    const fetchTrending = async (): Promise<void> => {
      if (status !== SEARCH_STATUS.BEFORE_SEARCH) return;

      try {
        const gifs = await gifAPIService.getTrending();
        setGifList(gifs);
      } catch (error) {
        handleError(error);
      }
    };

    void fetchTrending();
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
