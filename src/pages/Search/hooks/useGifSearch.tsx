import { ChangeEvent, useEffect, useState } from 'react';

import { GifImageModel } from '../../../models/image/gifImage';
import useFetchTrending from '../../../store/queries/useFetchTrending';
import useFetchInfiniteGifList from '../../../store/queries/useFetchInfiniteGifList';

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
  const [userTypeKeyword, setUserTypeKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data: trendingGifs } = useFetchTrending();
  const [gifList, setGifList] = useState<GifImageModel[]>(trendingGifs.gifImages);

  const {
    data: searchGifs,
    fetchNextPage: loadMore,
    hasNextPage
  } = useFetchInfiniteGifList(searchKeyword);

  const updateSearchKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setUserTypeKeyword(e.target.value);
  };

  const searchByKeyword = async (): Promise<void> => {
    setSearchKeyword(userTypeKeyword);
  };

  useEffect(() => {
    if (!searchGifs) return;
    if (!hasNextPage) {
      setStatus(SEARCH_STATUS.NO_RESULT);
    }
    setGifList(
      searchKeyword === ''
        ? trendingGifs.gifImages
        : searchGifs.pages.flatMap((page) => page.gifImages)
    );
    setStatus(SEARCH_STATUS.FOUND);
  }, [searchGifs]);

  return {
    status,
    userTypeKeyword,
    gifList,
    searchByKeyword,
    updateSearchKeyword,
    loadMore
  } as const;
};

export default useGifSearch;
