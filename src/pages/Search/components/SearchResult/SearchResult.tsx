import React, { useMemo } from 'react';
import { GifImageModel } from '../../../../models/image/gifImage';

import GifItem from '../GifItem/GifItem';
import ResultTitle from '../ResultTitle/ResultTitle';

import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './SearchResult.module.css';

type SearchResultProps = {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
};

const MemoizedGifItem = React.memo(GifItem);

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps) => {
  const renderGifList = useMemo(
    () => (
      <div className={styles.gifResultWrapper}>
        {gifList.map((gif: GifImageModel) => (
          <MemoizedGifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
        ))}
      </div>
    ),
    [gifList]
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
            {renderGifList}
            {renderLoadMoreButton()}
          </>
        );
      case SEARCH_STATUS.BEFORE_SEARCH:
        return renderGifList;
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
