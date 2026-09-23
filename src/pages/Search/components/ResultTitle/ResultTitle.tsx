import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './ResultTitle.module.css';

interface ResultTitleProps {
  status: SearchStatus;
}

const ResultTitle = ({ status }: ResultTitleProps): JSX.Element => {
  switch (status) {
    case SEARCH_STATUS.NO_RESULT:
      return (
        <h3 className={styles.resultTitle}>
          <span>Nothing</span>🥲
        </h3>
      );
    case SEARCH_STATUS.BEFORE_SEARCH:
      return (
        <h3 className={styles.resultTitle}>
          🔥 <span>Trending Now</span> 🔥
        </h3>
      );
    case SEARCH_STATUS.ERROR:
      return (
        <h3 className={styles.resultTitle}>
          <span>Something Went Wrong</span>🥲
        </h3>
      );
    default:
      return (
        <h3 className={styles.resultTitle}>
          <span>We Found...</span>
        </h3>
      );
  }
};

export default ResultTitle;
