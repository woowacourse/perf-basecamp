import { KeyboardEvent, ChangeEvent } from 'react';
import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';

import styles from './SearchBar.module.css';

type SearchbarProps = {
  searchKeyword: string;
  onEnter: (e: KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
};

const SearchBar = ({ searchKeyword, onEnter, onChange, onSearch }: SearchbarProps) => {
  return (
    <section className={styles.searchbarSection}>
      <h3 className={styles.searchbarTitle}>- find the best gif now - </h3>
      <div className={styles.searchbarContainer}>
        <input
          className={styles.searchInput}
          type="text"
          value={searchKeyword}
          onKeyPress={onEnter}
          onChange={onChange}
        />
        <button className={styles.searchButton} type="button" onClick={onSearch}>
          <AiOutlineSearch color="white" size="2rem" />
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
