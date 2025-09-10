import { GifImageModel } from '../../../../models/image/gifImage';
import { useEffect } from 'react';
import useIntersectionObserver from '../../../Home/hooks/useIntersectionObserver';

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
  const { targetRef, hasIntersected } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: false
  });

  useEffect(() => {
    if (hasIntersected && status === SEARCH_STATUS.FOUND) {
      loadMore();
    }
  }, [hasIntersected, status, loadMore]);

  const renderGifList = () => (
    <div className={styles.gifResultWrapper}>
      {gifList.map((gif: GifImageModel, index) => (
        <GifItem key={`${gif.id}-${index}`} imageUrl={gif.imageUrl} title={gif.title} />
      ))}
    </div>
  );
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
            <div
              ref={targetRef}
              style={{ height: '1px', visibility: 'hidden' }}
              aria-hidden="true"
            />
          </>
        );
      case SEARCH_STATUS.BEFORE_SEARCH:
        return renderGifList();
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
