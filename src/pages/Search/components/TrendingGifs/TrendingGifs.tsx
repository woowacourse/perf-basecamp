import { use } from 'react';

import { trendingCache } from '../../trendingCache';
import GifItem from '../GifItem/GifItem';

import styles from '../SearchResult/SearchResult.module.css';

const TrendingGifs = () => {
  const gifs = use(trendingCache.load());

  return (
    <div className={styles.gifResultWrapper}>
      {gifs.map((gif) => (
        <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
      ))}
    </div>
  );
};

export default TrendingGifs;
