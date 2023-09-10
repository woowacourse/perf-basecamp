import { GifImageModel } from '../../../../models/image/gifImage';

import ResultTitle from '../ResultTitle/ResultTitle';
import GifItem from '../GifItem/GifItem';

import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './SearchResult.module.css';
import { DEFAULT_FETCH_COUNT } from '../../../../apis/gifAPIService';
import Skeleton from '../GifItem/Skeleton';

type SearchResultProps = {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
};

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps) => {
  return (
    <section className={styles.searchResultSection}>
      <ResultTitle status={status} />
      <div className={styles.gifResultWrapper}>
        {gifList.map((gif) => <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />)}
        {(status === SEARCH_STATUS.LOADING) && (
          Array.from({ length: DEFAULT_FETCH_COUNT }, () => <Skeleton />)
        )}
      </div>
      {status === SEARCH_STATUS.FOUND && (
        <button className={styles.loadMoreButton} onClick={loadMore}>
          load more
        </button>
      )}
    </section>
  );
};

export default SearchResult;
