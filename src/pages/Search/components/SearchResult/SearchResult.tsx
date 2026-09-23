import { GifImageModel } from '../../../../models/image/gifImage';

import ResultTitle from '../ResultTitle/ResultTitle';
import GifItem from '../GifItem/GifItem';

import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './SearchResult.module.css';

interface SearchResultProps {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
}

const SKELETON_COUNT = 16;

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps): JSX.Element => {
  const renderSkeleton = (): JSX.Element[] =>
    Array.from({ length: SKELETON_COUNT }, (_, index) => (
      <div key={index} className={styles.gifItemSkeleton} />
    ));

  const renderGifList = (): JSX.Element => (
    <div className={styles.gifResultWrapper}>
      {gifList.length === 0
        ? renderSkeleton()
        : gifList.map((gif: GifImageModel) => (
            <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
          ))}
    </div>
  );

  const renderLoadMoreButton = (): JSX.Element => (
    <button className={styles.loadMoreButton} onClick={loadMore}>
      load more
    </button>
  );

  const renderContent = (): JSX.Element => {
    switch (status) {
      case SEARCH_STATUS.FOUND:
        return (
          <>
            {renderGifList()}
            {renderLoadMoreButton()}
          </>
        );
      case SEARCH_STATUS.BEFORE_SEARCH:
      case SEARCH_STATUS.LOADING:
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
