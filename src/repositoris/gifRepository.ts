import { gifAPIService } from '../apis/gifAPIService';

import { GifImageModel } from '../models/image/gifImage';

interface CacheOptions {
  staleTime: number;
}

const defaultCacheOptions = {
  staleTime: 0
};

const cachePolicy = {
  isStale: (cachedAt: number, staleTime: number) => {
    return cachedAt + staleTime <= Date.now();
  }
};

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const cacheData: { [cacheKey: string]: CacheEntry<any> } = {};

const getCacheData = <T>(cacheKey: string): CacheEntry<T> | undefined => {
  return cacheData[cacheKey] as CacheEntry<T>;
};

const setCacheData = <T>(cacheKey: string, cacheEntry: CacheEntry<T>): void => {
  cacheData[cacheKey] = cacheEntry;
};

export const gifRepository = {
  getTrending: async (
    cacheOptions: CacheOptions = defaultCacheOptions
  ): Promise<GifImageModel[]> => {
    const cacheKey = 'trending';
    const cached = getCacheData<GifImageModel[]>(cacheKey);
    if (cached !== undefined && !cachePolicy.isStale(cached.cachedAt, cacheOptions.staleTime))
      return cached.data;

    const data = await gifAPIService.getTrending();
    const cacheEntry = {
      data,
      cachedAt: Date.now()
    };

    setCacheData(cacheKey, cacheEntry);
    return cacheEntry.data;
  },
  searchByKeyword: async (
    keyword: string,
    page: number,
    cacheOptions: CacheOptions = defaultCacheOptions
  ): Promise<GifImageModel[]> => {
    const cacheKey = `search:keyword=${keyword},page=${page}`;
    const cached = getCacheData<GifImageModel[]>(cacheKey);
    if (cached !== undefined && !cachePolicy.isStale(cached.cachedAt, cacheOptions.staleTime))
      return cached.data;

    const data = await gifAPIService.searchByKeyword(keyword, page);
    const cacheEntry = {
      data,
      cachedAt: Date.now()
    };

    setCacheData(cacheKey, cacheEntry);
    return cacheEntry.data;
  }
};
