import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';

const cacheData = new Map();

const apiKey = process.env.GIPHY_API_KEY || '';
const gf = new GiphyFetch(apiKey);

const DEFAULT_FETCH_COUNT = 16;

const TRENDING_GIF_API = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=${DEFAULT_FETCH_COUNT}&rating=g`;

async function cacheApi(api: string, key: string) {
  if (cacheData.has(key)) {
    return cacheData.get(key);
  }

  await fetch(api).then((res) => cacheData.set(key, res.json()));

  return cacheData.get(key);
}

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
    try {
      const gifs: GifsResult = await cacheApi(TRENDING_GIF_API, 'TRENDING_GIF_API');

      return convertResponseToModel(gifs.data);
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
  },
  cacheData: new Map()
};
