import { GifImageModel } from '../../../../types/gifImage';

import ResultTitle from '../ResultTitle/ResultTitle';
import GifItem from '../GifItem/GifItem';

import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './SearchResult.module.css';

interface SearchResultProps {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
}

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps): JSX.Element => {
  const renderGifList = (): JSX.Element => (
    <div className={styles.gifResultWrapper}>
      {gifList.map((gif: GifImageModel, index) => (
        <GifItem
          key={gif.id}
          imageUrl={gif.imageUrl}
          posterUrl={gif.posterUrl}
          videoUrl={gif.videoUrl}
          title={gif.title}
          priority={index === 0}
        />
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
