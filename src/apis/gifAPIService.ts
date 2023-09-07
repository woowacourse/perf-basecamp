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
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async function (): Promise<GifImageModel[]> {
    const cacheStorage = await caches.open('trending');
    const responseCache = await cacheStorage.match(TRENDING_GIF_API);

    try {
      if (responseCache) {
        const responseData: GifsResult = await responseCache.json();
        return convertResponseToModel(responseData.data);
      }

      const gifs: GifsResult = await fetch(TRENDING_GIF_API).then((res) => {
        const resClone = res.clone();
        cacheStorage.put(TRENDING_GIF_API, resClone);

        return res.json();
      });

      return convertResponseToModel(gifs.data);
    } catch (e) {
      return [];
    }
  }
};
