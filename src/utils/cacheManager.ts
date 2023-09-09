const CacheManager = {
  async getCachedData<T>(cacheName: string, cacheKey: string): Promise<T | null> {
    const cache = await caches.open(cacheName);
    const response = await cache.match(cacheKey);

    if (response) {
      const { expirationTime, data } = await response.json();

      if (Date.now() < expirationTime) return data;
    }

    return null;
  },

  async cacheData<T>(cacheName: string, cacheKey: string, data: T, cacheTime: number = 86400) {
    const cache = await caches.open(cacheName);
    const expirationTime = Date.now() + cacheTime;

    const cacheData = {
      data,
      expirationTime
    };

    const cacheResponse = new Response(JSON.stringify(cacheData));

    await cache.put(cacheKey, cacheResponse);
  }
};

export default CacheManager;
