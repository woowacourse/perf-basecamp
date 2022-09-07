import React, { Dispatch, SetStateAction, useState } from 'react';
import { GifImageModel } from '../models/image/gifImage';

export const SEARCH_STATUS = {
  BEFORE_SEARCH: 'BEFORE_SEARCH',
  LOADING: 'LOADING',
  FOUND: 'FOUND',
  NO_RESULT: 'NO_RESULT'
} as const;

export type SearchStatus = typeof SEARCH_STATUS[keyof typeof SEARCH_STATUS];

interface GifContextValue {
  status: SearchStatus;
  setStatus: Dispatch<SetStateAction<SearchStatus>>;
  gifList: GifImageModel[];
  setGifList: Dispatch<SetStateAction<GifImageModel[]>>;
}

const GifContext = React.createContext<GifContextValue>({} as GifContextValue);

export const GifContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<SearchStatus>(SEARCH_STATUS.BEFORE_SEARCH);
  const [gifList, setGifList] = useState<GifImageModel[]>([]);

  return (
    <GifContext.Provider value={{ status, setStatus, gifList, setGifList }}>
      {children}
    </GifContext.Provider>
  );
};

export default GifContext;
