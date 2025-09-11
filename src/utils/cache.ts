const CACHE_KEY_PREFIX = 'memegle_cache_';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export const sessionCache = {
  set: <T>(key: string, data: T): void => {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now()
    };
    
    try {
      sessionStorage.setItem(
        `${CACHE_KEY_PREFIX}${key}`, 
        JSON.stringify(cacheItem)
      );
    } catch (error) {
      console.warn('Failed to cache data to sessionStorage:', error);
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const cachedData = sessionStorage.getItem(`${CACHE_KEY_PREFIX}${key}`);
      
      if (!cachedData) {
        return null;
      }

      const cacheItem: CacheItem<T> = JSON.parse(cachedData);
      return cacheItem.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data from sessionStorage:', error);
      return null;
    }
  },

  clear: (key: string): void => {
    try {
      sessionStorage.removeItem(`${CACHE_KEY_PREFIX}${key}`);
    } catch (error) {
      console.warn('Failed to clear cached data from sessionStorage:', error);
    }
  }
};