import { GifsResult } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';
import { apiClient, ApiError } from '../utils/apiClient';

const API_KEY = process.env.GIPHY_API_KEY;
if (!API_KEY) {
  throw new Error('GIPHY_API_KEY is not set in environment variables');
}

const BASE_URL = 'https://api.giphy.com/v1/gifs';
const DEFAULT_FETCH_COUNT = 16;

const CACHE_NAME = 'giphy-trending-cache';
const CACHE_KEY = 'trending';
const CACHE_TTL = 10 * 60 * 1000;

const convertResponseToModel = (gifList: IGif[]): GifImageModel[] => {
  return gifList.map(({ id, title, images }) => {
    return {
      id,
      title: title ?? '',
      imageUrl: images.original.url
    };
  });
};

const fetchGifs = async (url: URL): Promise<GifImageModel[]> => {
  try {
    const gifs = await apiClient.fetch<GifsResult>(url);

    return convertResponseToModel(gifs.data);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error: ${error.status} - ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

export const gifAPIService = {
  /**
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async (): Promise<GifImageModel[]> => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(CACHE_KEY);

      if (cachedResponse) {
        const { data, cachedAt } = await cachedResponse.json();
        if (Date.now() - cachedAt < CACHE_TTL) {
          return data;
        }
      }

      const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
        api_key: API_KEY,
        limit: `${DEFAULT_FETCH_COUNT}`,
        rating: 'g'
      });

      const gifs = await fetchGifs(url);

      const wrapped = new Response(
        JSON.stringify({
          data: gifs,
          cachedAt: Date.now()
        }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      await cache.put(CACHE_KEY, wrapped);

      return gifs;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 검색어에 맞는 gif 목록을 가져옵니다.
   * @param {string} keyword
   * @param {number} page
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/search
   */
  searchByKeyword: async (keyword: string, page: number): Promise<GifImageModel[]> => {
    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/search`), {
      api_key: API_KEY,
      q: keyword,
      limit: `${DEFAULT_FETCH_COUNT}`,
      offset: `${page * DEFAULT_FETCH_COUNT}`,
      rating: 'g',
      lang: 'en'
    });

    return fetchGifs(url);
  }
};
