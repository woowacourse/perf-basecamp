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

const TRENDING_TTL_MS = 30 * 60 * 1000; // 30분
const TRENDING_CACHE_KEY = 'trending_gifs_cache_v1';
const TRENDING_CACHE_AT_KEY = 'trending_gifs_cache_at_v1';

let trendingCache: GifImageModel[] | null = null;
let trendingCacheAt: number | null = null;
let trendingPending: Promise<GifImageModel[]> | null = null;

const readTrendingCacheFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const cached = localStorage.getItem(TRENDING_CACHE_KEY);
    const cachedAt = localStorage.getItem(TRENDING_CACHE_AT_KEY);
    if (cached && cachedAt) {
      trendingCache = JSON.parse(cached) as GifImageModel[];
      trendingCacheAt = Number(cachedAt);
    }
  } catch {}
};
readTrendingCacheFromStorage();

const isFresh = (ts: number | null): boolean => ts !== null && Date.now() - ts < TRENDING_TTL_MS;

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
    if (trendingCache && isFresh(trendingCacheAt)) {
      return trendingCache;
    }
    if (trendingPending) {
      return trendingPending;
    }

    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    trendingPending = fetchGifs(url)
      .then((gifs) => {
        trendingCache = gifs;
        trendingCacheAt = Date.now();

        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify(gifs));
            localStorage.setItem(TRENDING_CACHE_AT_KEY, String(trendingCacheAt));
          }
        } catch {}

        return gifs;
      })
      .finally(() => {
        trendingPending = null;
      });

    return trendingPending;
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
