import styles from './TrendingGifsFallback.module.css';
import resultStyles from '../SearchResult/SearchResult.module.css';

const PLACEHOLDER_COUNT = 16;

const TrendingGifsFallback = () => {
  return (
    <div className={resultStyles.gifResultWrapper}>
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <div key={index} className={styles.placeholder} />
      ))}
    </div>
  );
};

export default TrendingGifsFallback;
