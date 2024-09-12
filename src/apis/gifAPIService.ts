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
const CACHE_EXPIRATION_TIME = 12 * 60 * 60 * 1000; // 12시간

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
    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    try {
      const cacheStorage = await caches.open('trending');
      const cachedResponse = await cacheStorage.match(url);

      // 캐시된 응답이 있는 경우 타임스탬프를 확인
      if (cachedResponse) {
        const cachedTimestamp = await cacheStorage.match(url + '-timestamp');

        if (cachedTimestamp) {
          const timestamp = await cachedTimestamp.json();
          const now = Date.now();

          // 만료 시간이 지나지 않았다면 캐시된 응답을 반환
          if (now - timestamp < CACHE_EXPIRATION_TIME) {
            const gifs: GifsResult = await cachedResponse.json();
            return convertResponseToModel(gifs.data);
          }
        }
      }

      // 캐시된 응답이 없거나 만료 시간이 지난 경우 네트워크 요청
      const response = await fetch(url.toString());

      if (response.ok) {
        // 네트워크 요청 성공 시, 응답과 타임스탬프를 캐시에 저장
        await cacheStorage.put(url, response.clone());
        await cacheStorage.put(url + '-timestamp', new Response(JSON.stringify(Date.now())));

        const gifs: GifsResult = await response.json();
        return convertResponseToModel(gifs.data);
      } else {
        throw new Error('네트워크 요청 실패!');
      }
    } catch (e) {
      console.error('캐시 또는 네트워크 요청 중 오류 발생:', e);
      return [];
    }
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
