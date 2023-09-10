import { ChangeEvent, useEffect, useState } from 'react';

import { gifAPIService } from '../../../apis/gifAPIService';
import { GifImageModel } from '../../../models/image/gifImage';

const DEFAULT_PAGE_INDEX = 0;

export const SEARCH_STATUS = {
  BEFORE_SEARCH: 'BEFORE_SEARCH',
  LOADING: 'LOADING',
  FOUND: 'FOUND',
  NO_RESULT: 'NO_RESULT'
} as const;

export type SearchStatus = typeof SEARCH_STATUS[keyof typeof SEARCH_STATUS];

const useGifSearch = () => {
  const [status, setStatus] = useState<SearchStatus>(SEARCH_STATUS.BEFORE_SEARCH);
  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [gifList, setGifList] = useState<GifImageModel[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const updateSearchKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const resetSearch = () => {
    setStatus(SEARCH_STATUS.LOADING);
    setCurrentPageIndex(DEFAULT_PAGE_INDEX);
  };

  const searchByKeyword = () => async () => {
    resetSearch();

    const gifs: GifImageModel[] = await gifAPIService.searchByKeyword(
      searchKeyword,
      DEFAULT_PAGE_INDEX
    );

    if (gifs.length === 0) {
      setStatus(SEARCH_STATUS.NO_RESULT);
      return;
    }

    setGifList(gifs);
    setStatus(SEARCH_STATUS.FOUND);
  };

  const loadMore = async () => {
    setStatus(SEARCH_STATUS.LOADING);

    const nextPageIndex = currentPageIndex + 1;
    const gifs: GifImageModel[] = await gifAPIService.searchByKeyword(searchKeyword, nextPageIndex);

    setGifList([...gifList, ...gifs]);
    setCurrentPageIndex(nextPageIndex);

    setStatus(SEARCH_STATUS.FOUND);
  };

  useEffect(() => {
    const fetch = async () => {
      if (status === SEARCH_STATUS.BEFORE_SEARCH) {
        setStatus(SEARCH_STATUS.LOADING);

        const gifs: GifImageModel[] = await gifAPIService.getTrending();

        if (gifs.length === 0) {
          setStatus(SEARCH_STATUS.NO_RESULT);
          return;
        }

        setGifList(gifs);
        setStatus(SEARCH_STATUS.BEFORE_SEARCH);
      }
    };
    fetch();

    return () => setStatus(SEARCH_STATUS.LOADING);
  }, []);

  return {
    status,
    searchKeyword,
    gifList,
    searchByKeyword,
    updateSearchKeyword,
    loadMore
  } as const;
};

export default useGifSearch;
