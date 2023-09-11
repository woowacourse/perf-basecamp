type CacheValue = { validTime: number; result: unknown };

const cache = new Map<string, CacheValue>();

const CACHE_TIME = 30000;

const checkCache = <T>(query: string, callback: () => T): T => {
  const currentTime = new Date().getTime();
  const cacheData = cache.get(query);

  if (cacheData && cacheData.validTime > currentTime) {
    return cacheData.result as T;
  }

  const data = callback();

  cache.set(query, {
    validTime: currentTime + CACHE_TIME,
    result: data
  });

  return data;
};

export default checkCache;
