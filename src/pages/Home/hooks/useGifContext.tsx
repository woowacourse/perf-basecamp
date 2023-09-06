import { PropsWithChildren, createContext, useState } from 'react';
import { GifImageModel } from '../../../models/image/gifImage';

export const GifContext = createContext(
  {} as {
    gifList: GifImageModel[] | null;
    setGifList: (gif: GifImageModel[]) => void;
  }
);

export default function GifProvider({ children }: PropsWithChildren) {
  const [gifList, setGifList] = useState<GifImageModel[] | null>(null);
  return (
    <GifContext.Provider
      value={{
        gifList,
        setGifList
      }}
    >
      {children}
    </GifContext.Provider>
  );
}
