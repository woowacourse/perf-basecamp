import { gifAPIService } from '../apis/gifAPIService';

import { GifImageModel } from '../models/image/gifImage';

let trendingCacheData: GifImageModel[] | null = null;

export const gifRepository = {
  getTrending: async (): Promise<GifImageModel[]> => {
    if (trendingCacheData != null) return trendingCacheData;

    trendingCacheData = await gifAPIService.getTrending();
    return trendingCacheData;
  }
};
