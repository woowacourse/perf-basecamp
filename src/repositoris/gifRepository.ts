import { gifAPIService } from '../apis/gifAPIService';

import { GifImageModel } from '../models/image/gifImage';

const cacheTimePolicy = 24 * 60 * 60 * 1000;

let trendingCacheData: {
  data: GifImageModel[];
  time: number;
} | null = null;

export const gifRepository = {
  getTrending: async (): Promise<GifImageModel[]> => {
    if (trendingCacheData !== null && trendingCacheData.time + cacheTimePolicy > Date.now())
      return trendingCacheData.data;

    const data = await gifAPIService.getTrending();
    trendingCacheData = {
      data,
      time: Date.now()
    };
    return trendingCacheData.data;
  }
};
