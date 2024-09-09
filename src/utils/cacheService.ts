const DEFAULT_CACHE_DURATION = 1000 * 60 * 60;

export default class CacheService {
  private readonly cacheName: string;
  private readonly defaultCacheDuration: number;

  constructor({
    cacheName,
    defaultCacheDuration = DEFAULT_CACHE_DURATION
  }: {
    cacheName: string;
    defaultCacheDuration?: number;
  }) {
    this.cacheName = cacheName;
    this.defaultCacheDuration = defaultCacheDuration;
  }

  async set<T>(
    key: string,
    value: T,
    cacheDuration: number = this.defaultCacheDuration
  ): Promise<void> {
    const cache = await caches.open(this.cacheName);
    const response = new Response(
      JSON.stringify({
        value,
        cacheExpireTime: Date.now() + cacheDuration
      })
    );

    await cache.put(key, response);
  }

  async get<T>(key: string): Promise<T | null> {
    const cache = await caches.open(this.cacheName);
    const response = await cache.match(key);

    if (!response) {
      return null;
    }

    const data = await response.json();

    if (Date.now() > data.cacheExpireTime) {
      await cache.delete(key);
      return null;
    }

    return data.value;
  }

  async delete(key: string): Promise<void> {
    const cache = await caches.open(this.cacheName);
    await cache.delete(key);
  }

  async clear(): Promise<void> {
    await caches.delete(this.cacheName);
  }
}
