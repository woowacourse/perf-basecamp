interface CacheItem<T> {
  data: T;
  expiredTime: number;
}

class Cache {
  private cache: Record<string, CacheItem<any>> = {};

  isValidCache(key: string): boolean {
    const item = this.cache[key];
    if (!item) return false;

    return Date.now() <= item.expiredTime;
  }

  get<T>(key: string): T | null {
    if (!this.cache[key]) return null;

    return this.cache[key].data;
  }

  set<T>(key: string, data: T, ttl: number): void {
    const expiredTime = Date.now() + ttl;
    this.cache[key] = { data, expiredTime };
  }
}

const cache = new Cache();

export default cache;
