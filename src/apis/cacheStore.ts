interface CacheProperty {
  cacheData: any;
  staleTime: number;
}

interface CacheOption {
  staleTime: number;
}

export const cacheStore: { [key: string]: CacheProperty } = {};

export const fetchWithCache = (
  key: string,
  fetcher: (...args: any[]) => any,
  { staleTime }: CacheOption
) => {
  if (cacheStore[key]?.cacheData) {
    return cacheStore[key].cacheData;
  }

  const data = fetcher();

  cacheStore[key] = {
    cacheData: data,
    staleTime
  };

  setTimeout(() => {
    delete cacheStore[key];
  }, staleTime);

  return data;
};
