import { type ChangeEvent, useCallback, type KeyboardEvent } from "react";
import useGifSearch from "./hooks/useGifSearch";

import SearchBar from "./components/SearchBar/SearchBar";
import SearchResult from "./components/SearchResult/SearchResult";
import HelpPanel from "./components/HelpPanel/HelpPanel";

import styles from "./Search.module.css";

const Search = () => {
	const {
		status,
		searchKeyword,
		gifList,
		searchByKeyword,
		updateSearchKeyword,
		loadMore,
	} = useGifSearch();

	const handleEnter = useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				searchByKeyword();
			}
		},
		[searchByKeyword],
	);

	const handleChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			updateSearchKeyword(e);
		},
		[updateSearchKeyword],
	);
	const handleSearch = useCallback(() => {
		searchByKeyword();
	}, [searchByKeyword]);
  
	return (
		<div className={styles.searchContainer}>
			<SearchBar
				searchKeyword={searchKeyword}
				onEnter={handleEnter}
				onChange={handleChange}
				onSearch={handleSearch}
			/>
			<SearchResult status={status} gifList={gifList} loadMore={loadMore} />
			<HelpPanel />
		</div>
	);
};

export default Search;
