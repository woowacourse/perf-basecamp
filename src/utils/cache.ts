export const createCacheUtil = (cacheName: string) => {
  const getCacheItem = async <T>(key: string) => {
    const cache = await caches.open(cacheName);
    const response = await cache.match(key);

    if (response) {
      const data = await response.json();
      return data as T;
    }

    return null;
  };

  const setCacheItem = async (key: string, value: any) => {
    const cache = await caches.open(cacheName);
    const response = new Response(JSON.stringify(value));
    await cache.put(key, response);
  };

  const isCacheExpired = (timestamp: number, expiryDuration: number): boolean => {
    return Date.now() - timestamp >= expiryDuration;
  };

  return {
    getCacheItem,
    setCacheItem,
    isCacheExpired
  };
};
