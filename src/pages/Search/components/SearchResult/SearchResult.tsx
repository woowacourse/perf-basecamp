import { GifImageModel } from '../../../../models/image/gifImage';

import ResultTitle from '../ResultTitle/ResultTitle';
import GifItem from '../GifItem/GifItem';

import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './SearchResult.module.css';
import { Suspense } from 'react';

type SearchResultProps = {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
};

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps) => {
  return (
    <section className={styles.searchResultSection}>
      <ResultTitle status={status} />
      <Suspense fallback={<div>로딩중입니다.</div>}>
        {(status === SEARCH_STATUS.FOUND || status === SEARCH_STATUS.BEFORE_SEARCH) && (
          <div className={styles.gifResultWrapper}>
            {gifList.map((gif: GifImageModel) => (
              <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
            ))}
          </div>
        )}{' '}
      </Suspense>
      {status === SEARCH_STATUS.FOUND && (
        <button className={styles.loadMoreButton} onClick={loadMore}>
          load more
        </button>
      )}
    </section>
  );
};

export default SearchResult;
