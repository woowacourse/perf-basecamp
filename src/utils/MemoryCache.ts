import getCurrentTimeInSeconds from './getCurrentTimeInSeconds';

type UnInitialized = null;

type GetCacheDataResult<T> =
  | {
      status: 'uninitialized';
      data: null;
    }
  | { status: 'staled'; data: T }
  | { status: 'fresh'; data: T };

class MemoryCache<T> {
  private data: T | UnInitialized = null;
  private staledTime = 86400; // 1 day
  private cacheTime = 0;

  constructor(data: T | UnInitialized, staledTime: number) {
    this.data = data;
    this.staledTime = staledTime;
    this.cacheTime = getCurrentTimeInSeconds();
  }

  getCachedData(): GetCacheDataResult<T> {
    if (this.data === null) {
      return {
        status: 'uninitialized',
        data: null
      };
    }
    const current = getCurrentTimeInSeconds();
    if (current >= this.cacheTime + this.staledTime) {
      return {
        status: 'staled',
        data: this.data
      };
    }
    return {
      status: 'fresh',
      data: this.data
    };
  }

  setCachedData(newData: T) {
    this.cacheTime = getCurrentTimeInSeconds();
    this.data = newData;
  }
}

export default MemoryCache;
