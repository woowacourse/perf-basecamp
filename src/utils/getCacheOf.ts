interface APIFn<T = unknown> {
  (): Promise<T>;
}

interface CacheStorage {
  [key: string]: Cache<never>;
}

interface Cache<T = unknown> {
  apiFn: APIFn<T>;
  data: T;
}

const cacheStorage: CacheStorage = {};

interface CacheOptions<T = unknown> {
  key: Array<string>;
  apiFn: APIFn<T>;
  cacheTime?: number;
}

const DEFAULT_CACHE_TIME = 300000;

const setCache = <T,>(key: string, cache: Cache<T>) =>
  Object.assign(cacheStorage, { [key]: cache });

const getCache = <T,>(key: string): Cache<T> => cacheStorage[key];

const clearCache = (key: string) => delete cacheStorage[key];

const runCacheTimer = (key: string, cacheTime: number) => {
  setTimeout(() => {
    clearCache(key);
  }, cacheTime);
};

const getCacheOf = async <T,>(options: CacheOptions<T>) => {
  const { key: rawKey, apiFn, cacheTime = DEFAULT_CACHE_TIME } = options;

  const key = rawKey.join();

  const cache = getCache<T>(key);

  if (cache) {
    return cache.data;
  }

  const data = await apiFn();

  setCache(key, { apiFn, data });
  runCacheTimer(key, cacheTime);

  return data;
};

export default getCacheOf;
