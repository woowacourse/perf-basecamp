interface CachedData<T> {
  data: T[];
  timestamp: number;
}

class CacheStore<T> {
  private cache: CachedData<T> | null = null;
  private cacheDuration: number;

  constructor(duration: number) {
    this.cacheDuration = duration;
  }

  private isValidCache(): boolean {
    if (!this.cache) return false;
    const currentTime = Date.now();
    return currentTime - this.cache.timestamp < this.cacheDuration;
  }

  setCache(data: T[]) {
    this.cache = {
      data,
      timestamp: Date.now()
    };
  }

  async execute(fetchCallback: () => Promise<T[]>): Promise<T[]> {
    if (this.isValidCache()) {
      return this.cache!.data;
    }

    const newData = await fetchCallback();

    this.setCache(newData);

    return newData;
  }
}

export default CacheStore;
