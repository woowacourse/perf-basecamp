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

let timeoutID: null | number = null;

export const gifAPIService = {
  /**
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async function (): Promise<GifImageModel[]> {
    const cacheStorage = await caches.open('trendingNow');
    const responsedCache = await cacheStorage.match(TRENDING_GIF_API);
    try {
      if (responsedCache) {
        const cacheData:GifsResult  = await responsedCache.json();

        if (timeoutID) clearTimeout(timeoutID);

        timeoutID = window.setTimeout(async () => {
          await cacheStorage.delete(TRENDING_GIF_API);

        }, 1000 * 60 * 5);

        return convertResponseToModel(cacheData.data);
      }
      const gifs: GifsResult = await fetch(TRENDING_GIF_API).then(async (res) => {
        const cloneRes = res.clone();
        await cacheStorage.put(TRENDING_GIF_API, cloneRes);

        setTimeout(async () => {
          await cacheStorage.delete(TRENDING_GIF_API);

        }, 1000 * 60 * 5);
        
        return res.json();
      })

      return convertResponseToModel(gifs.data);
    } catch (e) {
      console.log(e)
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
