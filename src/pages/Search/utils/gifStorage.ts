import { gifAPIService } from '../../../apis/gifAPIService';
import { GifImageModel } from '../../../models/image/gifImage';

const gifStorage = {
  async preLoad() {
    if (!this.getCache('init_trending')) {
      const trendingGifs: GifImageModel[] = await gifAPIService.getTrending();
      this.setCache('init_trending', trendingGifs);
    }
  },

  setCache(key: string, gifs: GifImageModel[]) {
    window.sessionStorage.setItem(key, JSON.stringify(gifs));
  },

  getCache(key: string) {
    try {
      const gifsString = window.sessionStorage.getItem(key) || '';
      return JSON.parse(gifsString) as GifImageModel[];
    } catch {
      window.sessionStorage.removeItem(key);
      return null;
    }
  }
};

export default gifStorage;
