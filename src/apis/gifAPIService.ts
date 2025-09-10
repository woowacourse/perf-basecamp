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
const TRENDING_CACHE_KEY = 'giphy_trending_cache_v1';
const TRENDING_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const TRENDING_CACHE_STORE = 'memegle-trending-cache-v1';

type TrendingCacheRecord = {
  data: GifImageModel[];
  ts: number;
};

let trendingMemoryCache: TrendingCacheRecord | null = null;

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
    const now = Date.now();
    if (trendingMemoryCache && now - trendingMemoryCache.ts < TRENDING_CACHE_TTL_MS) {
      return trendingMemoryCache.data;
    }

    try {
      const cache = await caches.open(TRENDING_CACHE_STORE);
      const cachedResponse = await cache.match(TRENDING_CACHE_KEY);
      if (cachedResponse) {
        const stored: TrendingCacheRecord = await cachedResponse.json();
        if (now - stored.ts < TRENDING_CACHE_TTL_MS && Array.isArray(stored.data)) {
          trendingMemoryCache = stored;
          return stored.data;
        }
      }
    } catch (error) {
      console.error(
        'Cache Storage Error:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    const data = await fetchGifs(url);

    trendingMemoryCache = { data, ts: now };
    try {
      const cache = await caches.open(TRENDING_CACHE_STORE);
      const record: TrendingCacheRecord = { data, ts: now };
      await cache.put(
        TRENDING_CACHE_KEY,
        new Response(JSON.stringify(record), {
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=0' }
        })
      );
    } catch (error) {
      console.error(
        'Cache Storage Error:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }

    return data;
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
