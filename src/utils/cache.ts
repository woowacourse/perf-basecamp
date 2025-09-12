interface CacheItem<T> {
  data: T;
  timestamp: number;
  timeToLive: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, timeToLive: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeToLive
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.timeToLive) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);

    if (!item) {
      return false;
    }

    if (Date.now() - item.timestamp > item.timeToLive) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    const now = Date.now();
    let validItems = 0;
    let expiredItems = 0;

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.timeToLive) {
        expiredItems++;
        this.cache.delete(key);
      } else {
        validItems++;
      }
    }

    return {
      total: this.cache.size,
      valid: validItems,
      expired: expiredItems
    };
  }
}

export const cache = new MemoryCache();

export const createCacheKey = (prefix: string, ...params: (string | number)[]): string => {
  return `${prefix}:${params.join(':')}`;
};

export const withCache = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyGenerator: (...args: T) => string,
  timeToLive: number = 5 * 60 * 1000 // 기본 5분
) => {
  return async (...args: T): Promise<R> => {
    const key = keyGenerator(...args);

    const cached = cache.get<R>(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);

    cache.set(key, result, timeToLive);

    return result;
  };
};
