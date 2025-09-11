import { GifsResult } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';
import { apiClient, ApiError } from '../utils/apiClient';
import { createCacheService } from './cacheService';

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
      imageUrl: images.original.webp ?? images.original.mp4 ?? images.original.url
    };
  });
};

export const fetchGifsFromApi = async (url: URL): Promise<GifsResult> => {
  try {
    return await apiClient.fetch<GifsResult>(url);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error: ${error.status} - ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

const cache = createCacheService('gif-api-cache');

export const fetchGifsWithCaching = async (url: URL): Promise<GifImageModel[]> => {
  const cacheKey = url.toString();

  const cachedData = await cache.get<GifsResult>(cacheKey);

  if (cachedData) {
    return convertResponseToModel(cachedData.data);
  }

  const gifs = await fetchGifsFromApi(url);

  await cache.set(cacheKey, gifs);

  return convertResponseToModel(gifs.data);
};
export const fetchGifsWithoutCaching = async (url: URL): Promise<GifImageModel[]> => {
  const gifs = await fetchGifsFromApi(url);
  return convertResponseToModel(gifs.data);
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

    return fetchGifsWithCaching(url);
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

    return fetchGifsWithoutCaching(url);
  }
};
