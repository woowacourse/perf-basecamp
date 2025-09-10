const DEFAULT_TTL = 10 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

async function getCache(cacheName: string): Promise<Cache> {
  return caches.open(cacheName);
}

export async function getCachedData<T>(
  cacheName: string,
  url: string,
  ttl: number = DEFAULT_TTL
): Promise<T | null> {
  const cache = await getCache(cacheName);
  const cachedResponse = await cache.match(url);

  if (!cachedResponse) {
    return null;
  }

  const cachedItem = (await cachedResponse.clone().json()) as CacheItem<T>;
  const isExpired = Date.now() - cachedItem.timestamp > ttl;

  if (isExpired) {
    await cache.delete(url);
    return null;
  }

  return cachedItem.data;
}

export async function setCacheData<T>(cacheName: string, url: string, data: T): Promise<void> {
  const cache = await getCache(cacheName);
  const dataWithTimestamp: CacheItem<T> = {
    data,
    timestamp: Date.now()
  };

  const response = new Response(JSON.stringify(dataWithTimestamp), {
    headers: { 'Content-Type': 'application/json' }
  });

  await cache.put(url, response);
}
