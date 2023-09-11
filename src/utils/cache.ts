import { CACHE_KEY } from '../constants/cache';

type CacheOption = {
  key: valueof<typeof CACHE_KEY>;
  fetchFn: PromiseFunction;
  cacheTime: number;
};

type CacheResult<Data> = Promise<Data>;

export const localCacheStorage = {
  get: (key: string) => {
    const localItem = localStorage.getItem(key);
    if (localItem) {
      return JSON.parse(localItem);
    }
    return null;
  },
  set: (key: string, value: any) => {
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  },
  delete: (key: string) => {
    localStorage.removeItem(key);
  }
};

export const fetchWithCache = async <Data>({
  key,
  fetchFn,
  cacheTime
}: CacheOption): CacheResult<Data> => {
  const localData = localCacheStorage.get(key);

  if (localData) {
    return localData;
  }

  const data: Data = await fetchFn();

  localCacheStorage.set(key, data);

  setTimeout(() => {
    localCacheStorage.delete(key);
  }, cacheTime);

  return data;
};
