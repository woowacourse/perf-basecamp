import { Suspense } from 'react';

import { GifImageModel } from '../../../../models/image/gifImage';
import ErrorBoundary from '../../../../components/ErrorBoundary/ErrorBoundary';

import ResultTitle from '../ResultTitle/ResultTitle';
import GifGrid from '../GifGrid/GifGrid';
import GifItem from '../GifItem/GifItem';
import TrendingGifs from '../TrendingGifs/TrendingGifs';
import TrendingGifsFallback from '../TrendingGifs/TrendingGifsFallback';

import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './SearchResult.module.css';

type SearchResultProps = {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
};

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps) => {
  const renderGifList = () => (
    <GifGrid>
      {gifList.map((gif: GifImageModel) => (
        <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
      ))}
    </GifGrid>
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
        return (
          <ErrorBoundary>
            <Suspense fallback={<TrendingGifsFallback />}>
              <TrendingGifs />
            </Suspense>
          </ErrorBoundary>
        );
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
