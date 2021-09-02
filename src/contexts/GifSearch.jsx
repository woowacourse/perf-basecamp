import React, { createContext, useState } from 'react';
import { DEFAULT_PAGE_INDEX } from '../constants/gifSearch';

export const GifSearchContext = createContext();

export const GifSearchContextProvider = ({ children }) => {
  const [gifList, setGifList] = useState([]);
  const [showTrending, setShowTrending] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <GifSearchContext.Provider
      value={{
        gifList,
        showTrending,
        noResult,
        currentPageIndex,
        searchKeyword,
        setGifList,
        setShowTrending,
        setNoResult,
        setCurrentPageIndex,
        setSearchKeyword,
      }}
    >
      {children}
    </GifSearchContext.Provider>
  );
};
