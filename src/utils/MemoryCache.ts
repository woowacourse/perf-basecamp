import getCurrentTimeInSeconds from './getCurrentTimeInSeconds';

class MemoryCache<T> {
  private data: T | null = null;
  private staledTime = 86400; // 1 day
  private cacheTime = 0;

  constructor(data: T | null, staledTime: number) {
    this.data = data;
    this.staledTime = staledTime;
    this.cacheTime = getCurrentTimeInSeconds();
  }

  getCachedData() {
    const current = getCurrentTimeInSeconds();
    if (current >= this.cacheTime + this.staledTime) {
      return false;
    }
    return this.data;
  }

  setCachedData(newData: T) {
    this.cacheTime = getCurrentTimeInSeconds();
    this.data = newData;
  }
}

export default MemoryCache;
