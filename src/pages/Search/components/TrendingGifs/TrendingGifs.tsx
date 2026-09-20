import { use } from 'react';

import { trendingCache } from '../../trendingCache';
import GifGrid from '../GifGrid/GifGrid';
import GifItem from '../GifItem/GifItem';

const TrendingGifs = () => {
  const gifs = use(trendingCache.load());

  return (
    <GifGrid>
      {gifs.map((gif) => (
        <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
      ))}
    </GifGrid>
  );
};

export default TrendingGifs;
