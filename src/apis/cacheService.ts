export const createCacheService = (cacheName: string) => {
  let cache: Cache | null = null;

  const getCache = async (): Promise<Cache> => {
    if (!cache) {
      cache = await caches.open(cacheName);
    }
    return cache;
  };

  return {
    async get<T>(key: string): Promise<T | null> {
      const cacheInstance = await getCache();
      const cachedResponse = await cacheInstance.match(key);

      if (!cachedResponse) return null;

      const cachedData = await cachedResponse.json();

      if (cachedData.expiresAt && Date.now() > cachedData.expiresAt) {
        await cacheInstance.delete(key);
        return null;
      }

      return cachedData.data as T;
    },

    async set(key: string, data: any, ttlMs = 86400): Promise<void> {
      const cacheInstance = await getCache();

      const cacheData = {
        data,
        createdAt: Date.now(),
        expiresAt: Date.now() + ttlMs
      };

      const response = new Response(JSON.stringify(cacheData), {
        headers: { 'Content-Type': 'application/json' }
      });

      await cacheInstance.put(key, response);
    }
  };
};
