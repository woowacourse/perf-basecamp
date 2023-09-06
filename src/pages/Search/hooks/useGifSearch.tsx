import { useEffect, useRef, useState } from 'react';

import { gifAPIService } from '../../../apis/gifAPIService';
import { GifImageModel } from '../../../models/image/gifImage';
import gifStorage from '../utils/gifStorage';

const DEFAULT_PAGE_INDEX = 0;

export const SEARCH_STATUS = {
  BEFORE_SEARCH: 'BEFORE_SEARCH',
  LOADING: 'LOADING',
  FOUND: 'FOUND',
  NO_RESULT: 'NO_RESULT'
} as const;

export type SearchStatus = (typeof SEARCH_STATUS)[keyof typeof SEARCH_STATUS];

const useGifSearch = () => {
  const [status, setStatus] = useState<SearchStatus>(SEARCH_STATUS.BEFORE_SEARCH);
  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [gifList, setGifList] = useState<GifImageModel[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const resetSearch = () => {
    setStatus(SEARCH_STATUS.LOADING);
    setCurrentPageIndex(DEFAULT_PAGE_INDEX);
  };

  const searchByKeyword = async () => {
    resetSearch();
    const currentKeyword = ref.current?.value!;

    const cachedGifs = gifStorage.getCache(currentKeyword);

    if (!cachedGifs || cachedGifs.length === 0) {
      const gifs: GifImageModel[] = await gifAPIService.searchByKeyword(
        currentKeyword,
        DEFAULT_PAGE_INDEX
      );

      if (gifs.length === 0) {
        setStatus(SEARCH_STATUS.NO_RESULT);
        return;
      }

      gifStorage.setCache(currentKeyword, gifs);
      setSearchKeyword(currentKeyword);
      setGifList(gifs);
      setStatus(SEARCH_STATUS.FOUND);
      return;
    }
    setSearchKeyword(currentKeyword);
    setGifList(cachedGifs);
    setStatus(SEARCH_STATUS.FOUND);
  };

  const loadMore = async () => {
    const nextPageIndex = currentPageIndex + 1;
    const gifs: GifImageModel[] = await gifAPIService.searchByKeyword(searchKeyword, nextPageIndex);

    if (!ref) return;

    setGifList([...gifList, ...gifs]);
    setCurrentPageIndex(nextPageIndex);
  };

  useEffect(() => {
    const trendingGifs = gifStorage.getCache('init_trending');
    if (!trendingGifs) {
      const fetch = async () => {
        if (status === SEARCH_STATUS.BEFORE_SEARCH) {
          const gifs: GifImageModel[] = await gifAPIService.getTrending();
          window.sessionStorage.setItem('init', JSON.stringify(gifs));
          const gifsInSession = JSON.parse(window.sessionStorage.getItem('init') || '');
          setGifList(gifsInSession);
        }
      };
      fetch();
      return;
    }

    setGifList(trendingGifs);

    return () => setStatus(SEARCH_STATUS.LOADING);
  }, []);

  return {
    status,
    searchKeyword,
    gifList,
    ref,
    searchByKeyword,
    loadMore
  } as const;
};

export default useGifSearch;
