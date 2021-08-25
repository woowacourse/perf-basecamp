import { useContext } from 'react';
import { TrendingContext } from '../contexts/Trending';

const useTrending = () => {
  const trending = useContext(TrendingContext);

  if (!trending) {
    throw new Error('TrendingProvider가 컨텍스트 범위에 존재하지 않습니다.');
  }

  return {
    trendingList: trending.trendingList,
    setTrendingList: trending.setTrendingList,
  };
};

export default useTrending;
