import { GifsResult } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';
import { apiClient, ApiError } from '../utils/apiClient';

const TRENDING_CACHE_KEY = 'trending';
const TRENDING_TTL = 10 * 60 * 1000;
type Cache<T> = { savedAt: number; data: T };

let trendingMem: Cache<GifImageModel[]> | null = null;
let trendingInflight: Promise<GifImageModel[]> | null = null;

async function fetchTrendingRaw(): Promise<GifImageModel[]> {
  const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
    api_key: API_KEY!,
    limit: `${DEFAULT_FETCH_COUNT}`,
    rating: 'g'
  });
  return fetchGifs(url);
}

async function getTrendingCached(): Promise<GifImageModel[]> {
  const now = Date.now();

  if (trendingMem && now - trendingMem.savedAt < TRENDING_TTL) return trendingMem.data;

  const raw = localStorage.getItem(TRENDING_CACHE_KEY);
  if (raw) {
    try {
      const cached: Cache<GifImageModel[]> = JSON.parse(raw);
      if (now - cached.savedAt < TRENDING_TTL) {
        trendingMem = cached;
        return cached.data;
      }
    } catch {
      /* ignore */
    }
  }

  if (trendingInflight) return trendingInflight;

  trendingInflight = fetchTrendingRaw()
    .then((data) => {
      const entry: Cache<GifImageModel[]> = { savedAt: Date.now(), data };
      trendingMem = entry;
      localStorage.setItem(TRENDING_CACHE_KEY, JSON.stringify(entry));
      return data;
    })
    .finally(() => {
      trendingInflight = null;
    });

  return trendingInflight;
}

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
  getTrending: getTrendingCached,
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
