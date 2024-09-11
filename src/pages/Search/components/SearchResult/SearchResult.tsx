import { GifItemSkeleton, MemorizedGifItem } from '../GifItem/GifItem';
import { SEARCH_STATUS, SearchStatus } from '../../hooks/useGifSearch';

import { GifImageModel } from '../../../../models/image/gifImage';
import ResultTitle from '../ResultTitle/ResultTitle';
import styles from './SearchResult.module.css';

type SearchResultProps = {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
};

const renderGifSkeleton = () => (
  <div className={styles.gifResultWrapper}>
    {Array.from({ length: 16 }).map((_, i) => (
      <GifItemSkeleton key={i} />
    ))}
  </div>
);

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps) => {
  const renderGifList = () => (
    <div className={styles.gifResultWrapper}>
      {gifList.map((gif: GifImageModel) => (
        <MemorizedGifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
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
          </>
        );
      case SEARCH_STATUS.BEFORE_SEARCH:
        if (gifList.length === 0) return renderGifSkeleton();
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
