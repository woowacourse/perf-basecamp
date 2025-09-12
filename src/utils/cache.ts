class Cache {
  private cache: Map<string, { data: any; timestamp: number }>;

  constructor() {
    this.cache = new Map();
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!this.validate(key)) {
      return null;
    }

    return cached!.data;
  }

  set<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, { data, timestamp: Date.now() + ttl });
  }

  has(key: string): boolean {
    const cached = this.cache.get(key);
    return !!cached;
  }

  isExpired(key: string): boolean {
    const cached = this.cache.get(key);

    return !this.has(key) || Date.now() > cached!.timestamp;
  }

  validate(key: string) {
    if (this.isExpired(key)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new Cache();
