import { gifAPIService } from '../apis/gifAPIService';

import { GifImageModel } from '../models/image/gifImage';

const staleTime = 24 * 60 * 60 * 1000;

let trendingCacheData: {
  data: GifImageModel[];
  cachedAt: number;
} | null = null;

export const gifRepository = {
  getTrending: async (): Promise<GifImageModel[]> => {
    if (trendingCacheData !== null && trendingCacheData.cachedAt + staleTime > Date.now())
      return trendingCacheData.data;

    const data = await gifAPIService.getTrending();
    trendingCacheData = {
      data,
      cachedAt: Date.now()
    };
    return trendingCacheData.data;
  }
};
