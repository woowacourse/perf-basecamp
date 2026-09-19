import { gifAPIService } from '../apis/gifAPIService';

import { GifImageModel } from '../models/image/gifImage';

const staleTime = 24 * 60 * 60 * 1000;

const cachePolicy = {
  isStale: (cachedAt: number) => {
    return cachedAt + staleTime <= Date.now();
  }
};

interface CacheData {
  data: any;
  cachedAt: number;
}

const cacheData: { [cacheKey: string]: CacheData } = {};

export const gifRepository = {
  getTrending: async (): Promise<GifImageModel[]> => {
    const cacheKey = 'trending';
    let trendingCacheData = cacheData[cacheKey];
    if (cacheData[cacheKey] !== undefined && !cachePolicy.isStale(trendingCacheData.cachedAt))
      return trendingCacheData.data;

    const data = await gifAPIService.getTrending();
    trendingCacheData = {
      data,
      cachedAt: Date.now()
    };

    cacheData[cacheKey] = trendingCacheData;
    return trendingCacheData.data;
  },
  searchByKeyword: async (keyword: string, page: number): Promise<GifImageModel[]> => {
    const cacheKey = `search:keyword=${keyword},page=${page}`;
    let searchByKeywordCacheData = cacheData[cacheKey];
    if (
      cacheData[cacheKey] !== undefined &&
      !cachePolicy.isStale(searchByKeywordCacheData.cachedAt)
    )
      return searchByKeywordCacheData.data;

    const data = await gifAPIService.searchByKeyword(keyword, page);
    searchByKeywordCacheData = {
      data,
      cachedAt: Date.now()
    };

    cacheData[cacheKey] = searchByKeywordCacheData;
    return searchByKeywordCacheData.data;
  }
};
