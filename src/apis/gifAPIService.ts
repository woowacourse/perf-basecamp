import type { GifsResult } from '@giphy/js-fetch-api';
import type { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';
import { apiClient, ApiError } from '../utils/apiClient';

const API_KEY = process.env.GIPHY_API_KEY;
if (API_KEY === undefined || API_KEY === '') {
  throw new Error('GIPHY_API_KEY is not set in environment variables');
}

const BASE_URL = 'https://api.giphy.com/v1/gifs';
const DEFAULT_FETCH_COUNT = 16;
const TRENDING_CACHE_TTL = 30 * 60 * 1000;
let trendingRequest: Promise<GifImageModel[]> | undefined;
let trendingExpiresAt = 0;

const convertResponseToModel = (gifList: IGif[]): GifImageModel[] => {
  return gifList.map(({ id, title, images }) => {
    return {
      id,
      title: title ?? '',
      imageUrl: images.fixed_width?.webp ?? images.fixed_width?.url ?? images.original.url
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
   * Trending 결과를 30분간 재사용하고, 진행 중인 요청도 공유합니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async (): Promise<GifImageModel[]> => {
    if (trendingRequest !== undefined && Date.now() < trendingExpiresAt) {
      return await trendingRequest;
    }

    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    // Pending requests do not expire; the TTL starts after a successful response.
    trendingExpiresAt = Infinity;
    trendingRequest = fetchGifs(url)
      .then((gifs) => {
        trendingExpiresAt = Date.now() + TRENDING_CACHE_TTL;
        return gifs;
      })
      .catch((error: unknown) => {
        trendingRequest = undefined;
        trendingExpiresAt = 0;
        throw error;
      });

    return await trendingRequest;
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

    return await fetchGifs(url);
  }
};
