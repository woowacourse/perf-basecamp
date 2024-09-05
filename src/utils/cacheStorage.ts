const CACHE_EXPIRY = 60 * 60 * 1000; // 1시간 (캐시 유효 시간)

type CacheData<T> = {
  data: T;
  timestamp: number;
};

export const setCache = <T>(key: string, data: T) => {
  const cacheData: CacheData<T> = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

export const getCache = <T>(key: string): T | null => {
  const cachedItem = localStorage.getItem(key);
  if (cachedItem) {
    const parsedItem: CacheData<T> = JSON.parse(cachedItem);
    if (Date.now() - parsedItem.timestamp < CACHE_EXPIRY) {
      return parsedItem.data;
    }
    localStorage.removeItem(key);
  }
  return null;
};
