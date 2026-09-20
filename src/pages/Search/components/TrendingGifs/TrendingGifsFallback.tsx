import { DEFAULT_FETCH_COUNT } from '../../../../apis/gifAPIService';
import GifGrid from '../GifGrid/GifGrid';

import styles from './TrendingGifsFallback.module.css';

const TrendingGifsFallback = () => {
  return (
    <GifGrid>
      {Array.from({ length: DEFAULT_FETCH_COUNT }, (_, index) => (
        <div key={index} className={styles.placeholder} />
      ))}
    </GifGrid>
  );
};

export default TrendingGifsFallback;
