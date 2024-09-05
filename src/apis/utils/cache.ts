type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class Cache {
  private cache: Map<string, CacheEntry<any>>;

  constructor() {
    this.cache = new Map();
  }

  set<T>(key: string, value: T, staleTime: number) {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now() + staleTime
    };
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (entry && entry.timestamp > Date.now()) {
      return entry.data;
    } else if (entry) {
      this.cache.delete(key);
    }
    return undefined;
  }

  has(key: string): boolean {
    return this.cache.has(key) && this.cache.get(key)!.timestamp > Date.now();
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const cache = new Cache();
