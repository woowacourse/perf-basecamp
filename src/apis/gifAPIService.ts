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

const TRENDING_CACHE_KEY = 'giphy_trending_cache';
const CACHE_DURATION = 30 * 60 * 1000;

interface CacheData {
  data: GifImageModel[];
  timestamp: number;
}

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

const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

const getCachedTrending = (): GifImageModel[] | null => {
  try {
    const cached = localStorage.getItem(TRENDING_CACHE_KEY);
    if (!cached) return null;

    const cacheData: CacheData = JSON.parse(cached);

    if (isCacheValid(cacheData.timestamp)) {
      return cacheData.data;
    } else {
      localStorage.removeItem(TRENDING_CACHE_KEY);
      return null;
    }
  } catch (error) {
    console.error('Failed to parse cached trending data:', error);
    localStorage.removeItem(TRENDING_CACHE_KEY);
    return null;
  }
};

const setCachedTrending = (data: GifImageModel[]): void => {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Trending data cached');
  } catch (error) {
    console.error('Failed to cache trending data:', error);
  }
};

export const gifAPIService = {
  /**
   * trending gif 목록을 가져옵니다. (캐시 적용)
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async (): Promise<GifImageModel[]> => {
    const cachedData = getCachedTrending();
    if (cachedData) {
      return cachedData;
    }

    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    const data = await fetchGifs(url);

    setCachedTrending(data);

    return data;
  },

  /**
   * 검색어에 맞는 gif 목록을 가져옵니다. (캐시 미적용 - 검색어별로 다름)
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
