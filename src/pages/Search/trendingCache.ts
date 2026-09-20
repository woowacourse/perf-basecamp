import { gifAPIService } from '../../apis/gifAPIService';
import { GifImageModel } from '../../models/image/gifImage';

const MAX_AGE_MS = 10 * 60 * 1000;

let entry: { gifs: GifImageModel[]; fetchedAt: number } | null = null;

const isFresh = (fetchedAt: number): boolean => Date.now() - fetchedAt < MAX_AGE_MS;

export const trendingCache = {
  readFresh: (): GifImageModel[] | null => {
    if (entry === null || !isFresh(entry.fetchedAt)) return null;

    return entry.gifs;
  },
  refresh: async (): Promise<GifImageModel[]> => {
    const gifs = await gifAPIService.getTrending();
    entry = { gifs, fetchedAt: Date.now() };

    return gifs;
  }
};
