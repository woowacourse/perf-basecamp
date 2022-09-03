class APICache<T> {
  cache = new Map<string, T[]>();

  get(key: string): T[] {
    return this.cache.get(key) ?? [];
  }

  set(key: string, newItems: T[]) {
    if (this.cache.has(key)) {
      const oldItems = this.cache.get(key) ?? [];
      this.cache.set(key, [...oldItems, ...newItems]);
      return;
    }
    this.cache.set(key, newItems);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

export default APICache;
