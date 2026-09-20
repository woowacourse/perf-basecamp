import React, { memo, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

import styles from './SearchBar.module.css';

type SearchbarProps = {
  onSearch: (keyword: string) => void;
};

// 입력값 state를 Search가 아닌 이 컴포넌트가 들고 있는다.
// 상위는 검색이 실행되는 시점에만 키워드를 알면 되므로,
// 타이핑마다 Search 트리 전체(GifItem 16개 + ArtistInfo 100개)가
// 리렌더되던 문제가 사라진다.
const SearchBar = ({ onSearch }: SearchbarProps) => {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(keyword);
    }
  };

  return (
    <section className={styles.searchbarSection}>
      <h3 className={styles.searchbarTitle}>- find the best gif now -</h3>
      <div className={styles.searchbarContainer}>
        <input
          className={styles.searchInput}
          type="text"
          value={keyword}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
        />
        <button
          className={styles.searchButton}
          type="button"
          onClick={() => onSearch(keyword)}
          aria-label="search"
        >
          <AiOutlineSearch color="white" size="2rem" />
        </button>
      </div>
    </section>
  );
};

export default memo(SearchBar);
