import { GifImageModel } from '../../../../models/image/gifImage';

import ResultTitle from '../ResultTitle/ResultTitle';
import GifItem from '../GifItem/GifItem';

import { SearchStatus, SEARCH_STATUS } from '../../hooks/useGifSearch';

import styles from './SearchResult.module.css';

const SKELETON_COUNT = 16;

type SearchResultProps = {
  status: SearchStatus;
  gifList: GifImageModel[];
  loadMore: () => void;
};

const SearchResult = ({ status, gifList, loadMore }: SearchResultProps) => {
  const renderGifList = () => (
    <div className={styles.gifResultWrapper}>
      {gifList.map((gif: GifImageModel) => (
        <GifItem key={gif.id} imageUrl={gif.imageUrl} title={gif.title} />
      ))}
    </div>
  );

  // 결과가 도착하면서 섹션 높이가 커져 아래 콘텐츠가 밀리던 문제(CLS 0.197)를
  // 최종 레이아웃과 같은 크기의 자리를 미리 잡아 방지한다.
  const renderSkeleton = () => (
    <div className={styles.gifResultWrapper}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <div key={index} className={styles.gifSkeleton} />
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
      case SEARCH_STATUS.LOADING:
        return renderSkeleton();
      case SEARCH_STATUS.BEFORE_SEARCH:
        return gifList.length === 0 ? renderSkeleton() : renderGifList();
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
