class APICache<T> {
  cache = new Map<string, T[]>();

  get(key: string): T[] {
    return this.cache.get(key) ?? [];
  }

  set(key: string, newItems: T[]) {
    this.cache.set(key, newItems);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export default APICache;
