type DataFetcher<T> = () => Promise<T>;

interface CacheOptions {
  ttl?: number;
}

const memoryCache = new Map<string, { data: any; expiresAt: number }>();
const pendingRequests = new Map<string, Promise<any>>();

const DEFAULT_TTL = 60 * 60 * 1000;

export async function fetchWithCache<T>(
  key: string,
  fetcher: DataFetcher<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = DEFAULT_TTL } = options;
  const now = Date.now();

  const cached = memoryCache.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = fetcher()
    .then((data) => {
      memoryCache.set(key, { data, expiresAt: now + ttl });
      return data;
    })
    .finally(() => {
      pendingRequests.delete(key);
    });

  pendingRequests.set(key, promise);
  return promise;
}
