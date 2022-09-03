const CACHE_EXPIRE_TIME = 86400;

export async function getCachedData(cacheName: string, url: string) {
  const cacheStorage = await caches.open(cacheName);
  const cachedResponse = await cacheStorage.match(url);

  if (!cachedResponse || !cachedResponse.ok) {
    return false;
  }

  return await cachedResponse.json();
}

export async function cacheData(cacheName: string, url: string) {
  const cacheStorage = await caches.open(cacheName);
  await cacheStorage.add(url);
  setTimeout(() => {
    cacheStorage.delete(cacheName);
  }, CACHE_EXPIRE_TIME);
}
