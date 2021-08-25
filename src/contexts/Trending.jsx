import React, { createContext, useState } from 'react';

export const TrendingContext = createContext([]);

const TrendingProvider = ({ children }) => {
  const [trendingList, setTrendingList] = useState([]);

  return <TrendingContext.Provider value={{ trendingList, setTrendingList }}>{children}</TrendingContext.Provider>;
};

export default TrendingProvider;
