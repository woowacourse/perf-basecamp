const cache = {
  getCachedData: async (cacheName: string, url: string): Promise<unknown | false> => {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
      return false;
    }

    return await cachedResponse.json();
  },

  setCachedData: async (cacheName: string, url: string, data: unknown): Promise<void> => {
    const cacheStorage = await caches.open(cacheName);
    const response = new Response(JSON.stringify(data));
    await cacheStorage.put(url, response);
  },

  deleteOldCaches: async (currCacheName: string) => {
    const cacheNames = await caches.keys();

    cacheNames.forEach((cacheName) => {
      if (cacheName !== currCacheName) {
        caches.delete(cacheName);
      }
    });
  }
};

export default cache;
