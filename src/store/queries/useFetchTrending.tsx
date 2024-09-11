import { useSuspenseQuery } from '@tanstack/react-query';
import { gifAPIService } from '../../apis/gifAPIService';

const useFetchTrending = () => {
  return useSuspenseQuery({
    queryKey: ['search', 'trending'],
    queryFn: gifAPIService.getTrending,
    staleTime: Infinity,
    gcTime: Infinity
  });
};

export default useFetchTrending;
