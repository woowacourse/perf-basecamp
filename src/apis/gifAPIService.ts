import { GifsResult, GiphyFetch, SearchOptions, TrendingOptions } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';
import MemoryCache from '../utils/MemoryCache';

const apiKey = process.env.GIPHY_API_KEY || '';
const gf = new GiphyFetch(apiKey);

const DEFAULT_FETCH_COUNT = 16;

function convertResponseToModel(gifList: IGif[]): GifImageModel[] {
  return gifList.map((gif) => {
    const { id, title, images } = gif;

    return {
      id,
      title,
      imageUrl: images.original.url
    };
  });
}

type GifApiService = {
  cacheManager: MemoryCache<GifImageModel[]>;
  getTrending: () => Promise<GifImageModel[]>;
  searchByKeyword: (keyword: string, page: number) => Promise<GifImageModel[]>;
};

export const gifAPIService: GifApiService = {
  cacheManager: new MemoryCache<GifImageModel[]>(null, 10),

  /**
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async function (): Promise<GifImageModel[]> {
    const data = this.cacheManager.getCachedData();
    if (data !== null && data !== false) return data;

    const trendingOptions: TrendingOptions = {
      limit: DEFAULT_FETCH_COUNT,
      rating: 'g'
    };

    try {
      const gifs: GifsResult = await gf.trending(trendingOptions);
      const data = convertResponseToModel(gifs.data);
      this.cacheManager.setCachedData(data);
      return data;
    } catch (e) {
      return [];
    }
  },
  /**
   * 검색어에 맞는 gif 목록을 가져옵니다.
   * @param {string} keyword
   * @param {number} page
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/search
   */
  searchByKeyword: async function (keyword: string, page: number): Promise<GifImageModel[]> {
    const searchOptions: SearchOptions = {
      limit: DEFAULT_FETCH_COUNT,
      lang: 'en',
      offset: page * DEFAULT_FETCH_COUNT
    };

    try {
      const gifs: GifsResult = await gf.search(keyword, searchOptions);
      return convertResponseToModel(gifs.data);
    } catch (e) {
      return [];
    }
  }
};
