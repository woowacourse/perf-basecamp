import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { CACHE_KEY } from '../constants/keys';
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

export const gifAPIService: {
  cache: Record<string, GifImageModel[]>;
  getTrending: () => Promise<GifImageModel[]>;
  searchByKeyword: (keyword: string, page: number) => Promise<GifImageModel[]>;
} = {
  cache: {},
  /**
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async function (): Promise<GifImageModel[]> {
    if (this.cache.hasOwnProperty(CACHE_KEY.TRENDING)) {
      return this.cache[CACHE_KEY.TRENDING];
    }

    try {
      const gifs: GifsResult = await fetch(TRENDING_GIF_API).then((res) => res.json());
      const gifsModel = convertResponseToModel(gifs.data);

      this.cache[CACHE_KEY.TRENDING] = gifsModel;

      return gifsModel;
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
