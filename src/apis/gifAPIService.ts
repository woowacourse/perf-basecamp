import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';
import { cacheData, getCachedData } from '../storage/cacheStorage';

const apiKey = process.env.GIPHY_API_KEY || '';
const gf = new GiphyFetch(apiKey);

const DEFAULT_FETCH_COUNT = 16;
const TRENDING_GIF_API = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=${DEFAULT_FETCH_COUNT}&rating=g`;
const TRENDING_CACHE_NAME = 'getTrendingData';

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

export const gifAPIService = {
  /**
   * trending gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async function (): Promise<GifImageModel[]> {
    try {
      let cachedData = await getCachedData(TRENDING_CACHE_NAME, TRENDING_GIF_API);
      if (cachedData) {
        return convertResponseToModel(cachedData.data);
      }

      await cacheData(TRENDING_CACHE_NAME, TRENDING_GIF_API);

      cachedData = await getCachedData(TRENDING_CACHE_NAME, TRENDING_GIF_API);
      return convertResponseToModel(cachedData.data);
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
