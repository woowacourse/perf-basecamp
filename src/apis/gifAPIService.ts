import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';

const apiKey = process.env.GIPHY_API_KEY || '';
const gf = new GiphyFetch(apiKey);

const DEFAULT_FETCH_COUNT = 16;
const TRENDING_GIF_API = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=${DEFAULT_FETCH_COUNT}&rating=g`;

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

  getTrending: (function () {
    const getCurrentUTC = () => {
      const currentUTC = new Date(Date.now()).toUTCString();
      const currentWithoutTime = currentUTC.replace(/\d{2}:\d{2}:\d{2}/, '');

      return currentWithoutTime;
    };

    let cacheStore: GifImageModel[] | null = null;
    const cachedDate: string = getCurrentUTC();

    return async function (): Promise<GifImageModel[]> {
      if (cacheStore !== null && cachedDate === getCurrentUTC()) {
        return cacheStore;
      }

      try {
        const gifs: GifsResult = await fetch(TRENDING_GIF_API).then((res) => res.json());

        cacheStore = convertResponseToModel(gifs.data);

        return cacheStore;
      } catch (e) {
        return [];
      }
    };
  })(),

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
