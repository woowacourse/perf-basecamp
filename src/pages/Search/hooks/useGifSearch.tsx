import { ChangeEvent, useContext, useEffect, useState } from 'react';

import { gifAPIService } from '../../../apis/gifAPIService';
import GifContext from '../../../context/Gif';
import { GifImageModel } from '../../../models/image/gifImage';
import { SEARCH_STATUS } from '../../../context/Gif';

const DEFAULT_PAGE_INDEX = 0;

const useGifSearch = () => {
  const { status, setStatus, gifList, setGifList } = useContext(GifContext);

  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [searchKeyword, setSearchKeyword] = useState('');

  const updateSearchKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const resetSearch = () => {
    setStatus(SEARCH_STATUS.LOADING);
    setCurrentPageIndex(DEFAULT_PAGE_INDEX);
  };

  const searchByKeyword = async () => {
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
    const nextPageIndex = currentPageIndex + 1;
    const gifs: GifImageModel[] = await gifAPIService.searchByKeyword(searchKeyword, nextPageIndex);

    setGifList([...gifList, ...gifs]);
    setCurrentPageIndex(nextPageIndex);
  };

  useEffect(() => {
    const fetch = async () => {
      if (status === SEARCH_STATUS.BEFORE_SEARCH) {
        const gifs: GifImageModel[] = await gifAPIService.getTrending();

        setGifList(gifs);
      }
    };
    fetch();
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
