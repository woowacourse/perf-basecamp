import { useCallback, useEffect, useRef, useState } from 'react';

import { gifAPIService } from '../../../apis/gifAPIService';
import { GifImageModel } from '../../../models/image/gifImage';

const DEFAULT_PAGE_INDEX = 0;

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
  const [gifList, setGifList] = useState<GifImageModel[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 페이지 번호와 마지막 검색어는 렌더 결과에 직접 쓰이지 않으므로
  // state 대신 ref로 둔다. 변경돼도 리렌더가 발생하지 않는다.
  const currentPageIndex = useRef(DEFAULT_PAGE_INDEX);
  const lastKeyword = useRef('');

  const handleError = useCallback((error: unknown) => {
    setStatus(SEARCH_STATUS.ERROR);
    setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
  }, []);

  const searchByKeyword = useCallback(
    async (keyword: string): Promise<void> => {
      lastKeyword.current = keyword;
      currentPageIndex.current = DEFAULT_PAGE_INDEX;

      setStatus(SEARCH_STATUS.LOADING);
      setGifList([]);
      setErrorMessage(null);

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
    },
    [handleError]
  );

  const loadMore = useCallback(async (): Promise<void> => {
    const nextPageIndex = currentPageIndex.current + 1;

    try {
      const newGifList = await gifAPIService.searchByKeyword(lastKeyword.current, nextPageIndex);

      setGifList((prevGifList) => [...prevGifList, ...newGifList]);
      currentPageIndex.current = nextPageIndex;
    } catch (error) {
      handleError(error);
    }
  }, [handleError]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const gifs = await gifAPIService.getTrending();
        setGifList(gifs);
      } catch (error) {
        handleError(error);
      }
    };

    fetchTrending();
  }, [handleError]);

  return {
    status,
    gifList,
    errorMessage,
    searchByKeyword,
    loadMore
  } as const;
};

export default useGifSearch;
