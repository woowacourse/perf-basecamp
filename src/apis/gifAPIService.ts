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

const LS_KEY_TRENDING = 'giphy:trending:v1';
const TTL_MS = 6 * 60 * 60 * 1000;
let cacheData: GifImageModel[] | null = null;
let cacheTs = 0;
let inFlight: Promise<GifImageModel[]> | null = null;

const convertResponseToModel = (gifList: IGif[]): GifImageModel[] => {
  return gifList.map(({ id, title, images }) => ({
    id,
    title: title ?? '',
    imageUrl: images.original.url
  }));
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
   * trending gif 목록
   * - 메모리 + localStorage 캐시
   * - TTL: 6시간
   * - 중복요청 방지
   */
  getTrending: async (): Promise<GifImageModel[]> => {
    const freshMem = Date.now() - cacheTs < TTL_MS;
    if (cacheData && freshMem) return cacheData;

    if (inFlight) return inFlight;

    try {
      const trendingGifsRawData = localStorage.getItem(LS_KEY_TRENDING);
      if (trendingGifsRawData) {
        const { ts, data } = JSON.parse(trendingGifsRawData) as {
          ts: number;
          data: GifImageModel[];
        };
        if (Date.now() - ts < TTL_MS && Array.isArray(data)) {
          cacheData = data;
          cacheTs = ts;
          return data;
        }
      }
    } catch {}

    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    inFlight = fetchGifs(url)
      .then((data) => {
        cacheData = data;
        cacheTs = Date.now();
        try {
          sessionStorage.setItem(LS_KEY_TRENDING, JSON.stringify({ ts: cacheTs, data }));
        } catch {}
        return data;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  },

  /**
   * 키워드 검색
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
