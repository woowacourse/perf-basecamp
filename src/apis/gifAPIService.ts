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
const TRENDING_CACHE_TTL = 5 * 60 * 1000;

let trendingCache: { gifs: GifImageModel[]; cachedAt: number } | null = null;
let trendingRequest: Promise<GifImageModel[]> | null = null;

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

const fetchTrending = async (): Promise<GifImageModel[]> => {
  const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
    api_key: API_KEY,
    limit: `${DEFAULT_FETCH_COUNT}`,
    rating: 'g'
  });

  return fetchGifs(url);
};

const getTrending = async (): Promise<GifImageModel[]> => {
  const isCacheValid =
    trendingCache !== null && Date.now() - trendingCache.cachedAt < TRENDING_CACHE_TTL;

  if (isCacheValid && trendingCache !== null) {
    return trendingCache.gifs;
  }

  if (trendingRequest !== null) {
    return trendingRequest;
  }

  trendingRequest = fetchTrending();

  try {
    const gifs = await trendingRequest;
    trendingCache = { gifs, cachedAt: Date.now() };
    return gifs;
  } finally {
    trendingRequest = null;
  }
};

export const gifAPIService = {
  /**
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending,
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
