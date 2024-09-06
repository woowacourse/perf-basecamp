import { useInfiniteQuery } from '@tanstack/react-query';
import { gifAPIService } from '../../apis/gifAPIService';
import { GifConvertedData } from '../../models/image/gifImage';

const DEFAULT_PAGE_INDEX = 0;

const useFetchInfiniteGifList = (keyword: string) => {
  return useInfiniteQuery({
    queryKey: ['search', 'gifLists', keyword],
    queryFn: ({ pageParam = DEFAULT_PAGE_INDEX }) =>
      gifAPIService.searchByKeyword(keyword, pageParam),
    getNextPageParam: (lastPage: GifConvertedData) => {
      const responsePagination = lastPage.pagination;
      if (responsePagination.offset >= responsePagination.total_count) return undefined;
      return responsePagination.offset / responsePagination.count + 1;
    },
    initialPageParam: DEFAULT_PAGE_INDEX,
    enabled: keyword !== '',
    staleTime: Infinity,
    gcTime: Infinity
  });
};

export default useFetchInfiniteGifList;
