import React, { createContext, useContext, useState } from 'react';

const TrendingGifsContext = createContext({});

const TrendingGifsProvider = ({ children }) => {
  const [trendingGifs, setTrendingGifs] = useState([]);
  const [hasTrendingGifsViewed, setHasTrendingGifsViewed] = useState(false);

  const saveTrendingGifs = (gifs) => {
    setTrendingGifs(gifs);
    setHasTrendingGifsViewed(true);
  };

  return (
    <TrendingGifsContext.Provider
      value={{ trendingGifs, hasTrendingGifsViewed, saveTrendingGifs }}
    >
      {children}
    </TrendingGifsContext.Provider>
  );
};

export const useTrendingGifs = () => {
  return useContext(TrendingGifsContext);
};

export default TrendingGifsProvider;
