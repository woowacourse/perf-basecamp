import { GifImageModel } from '../../../../models/image/gifImage';
import { DEFAULT_FETCH_COUNT } from '../../../../apis/gifAPIService';

import ResultTitle from '../ResultTitle/ResultTitle';
import GifItem from '../GifItem/GifItem';

import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './SearchResult.module.css';

type SearchResultProps = {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
};

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps) => {
  const renderGifList = (showPlaceholders = false) => {
    return (
      <div className={styles.gifResultWrapper} aria-busy={showPlaceholders}>
        {showPlaceholders
          ? Array.from({ length: DEFAULT_FETCH_COUNT }, (_, index) => (
              <div key={index} className={styles.gifPlaceholder} aria-hidden="true" />
            ))
          : gifList.map((gif: GifImageModel) => (
              <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
            ))}
      </div>
    );
  };

  const renderLoadMoreButton = () => (
    <button className={styles.loadMoreButton} onClick={loadMore}>
      load more
    </button>
  );

  const renderContent = () => {
    switch (status) {
      case SEARCH_STATUS.FOUND:
        return (
          <>
            {renderGifList()}
            {renderLoadMoreButton()}
          </>
        );
      case SEARCH_STATUS.BEFORE_SEARCH:
        return renderGifList(gifList.length === 0);
      case SEARCH_STATUS.LOADING:
        return renderGifList(true);
      case SEARCH_STATUS.NO_RESULT:
      case SEARCH_STATUS.ERROR:
      default:
        return <></>;
    }
  };

  return (
    <section className={styles.searchResultSection}>
      <ResultTitle status={status} />
      {renderContent()}
    </section>
  );
};

export default SearchResult;
