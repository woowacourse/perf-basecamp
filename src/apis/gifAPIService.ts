import { GifsResult } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';
import { apiClient, ApiError } from '../utils/apiClient';

const CACHE_NAME = 'gif-cache';
const CACHE_LIFETIME = 10 * 60 * 1000;

const openCache = async () => {
  return await caches.open(CACHE_NAME);
};

const API_KEY = process.env.GIPHY_API_KEY;
if (!API_KEY) {
  throw new Error('GIPHY_API_KEY is not set in environment variables');
}

const BASE_URL = 'https://api.giphy.com/v1/gifs';
const DEFAULT_FETCH_COUNT = 16;

const convertResponseToModel = (gifList: IGif[]): GifImageModel[] => {
  return gifList.map(({ id, title, images }) => {
    return {
      id,
      title: title ?? '',
      imageUrl: images.original.url
    };
  });
};

const fetchGifsWithCache = async (url: URL): Promise<GifImageModel[]> => {
  try {
    const cache = await openCache();
    const cacheKey = url.toString();
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      const cachedData = await cachedResponse.json();

      const cacheTime = cachedData.timestamp;
      const now = Date.now();

      if (now - cacheTime < CACHE_LIFETIME) {
        return convertResponseToModel(cachedData.data);
      } else {
        await cache.delete(cacheKey);
      }
    }

    const gifs = await apiClient.fetch<GifsResult>(url);

    const cacheData = {
      data: gifs.data,
      timestamp: Date.now()
    };

    cache.put(
      cacheKey,
      new Response(JSON.stringify(cacheData), {
        headers: { 'Content-Type': 'application/json' }
      })
    );

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
    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    return fetchGifsWithCache(url);
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

    return fetchGifsWithCache(url);
  }
};
