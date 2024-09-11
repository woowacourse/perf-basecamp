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
const CACHE_NAME = 'memegle-cache';
const TRENDING_CACHE_KEY = 'trending-gifs';
const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1시간

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

const getTimestamp = () => new Date().getTime();

const cacheTrendingGifs = async (gifs: GifImageModel[]) => {
  const cache = await caches.open(CACHE_NAME);
  const response = new Response(
    JSON.stringify({
      gifs,
      timestamp: getTimestamp()
    })
  );
  await cache.put(TRENDING_CACHE_KEY, response);
};

const getTrendingFromCache = async (): Promise<GifImageModel[] | null> => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(TRENDING_CACHE_KEY);
  if (!cachedResponse || !cachedResponse.ok) {
    return null;
  }

  const { gifs, timestamp } = await cachedResponse.json();
  const now = getTimestamp();

  if (now - timestamp > CACHE_EXPIRATION_MS) {
    // 캐시 만료
    return null;
  }

  return gifs as GifImageModel[];
};

export const gifAPIService = {
  /**
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async (): Promise<GifImageModel[]> => {
    // 캐시에서 데이터 가져오기
    const cachedGifs = await getTrendingFromCache();
    if (cachedGifs) {
      return cachedGifs;
    }

    // 캐시에 데이터가 없으면 API 요청
    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    const gifs = await fetchGifs(url);

    // 캐시에 데이터 저장
    await cacheTrendingGifs(gifs);

    return gifs;
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
