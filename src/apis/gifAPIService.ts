import { GifsResult } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { GifImageModel } from '../models/image/gifImage';
import { apiClient, ApiError } from '../utils/apiClient';
import apiCallWithCache from './utils/apiWithCache';
import { GIF_KEYS } from './queries/keys';

const API_KEY = process.env.GIPHY_API_KEY;
if (!API_KEY) {
  throw new Error('GIPHY_API_KEY is not set in environment variables');
}

const BASE_URL = 'https://api.giphy.com/v1/gifs';
const DEFAULT_FETCH_COUNT = 16;
const TRENDING_STALE_TIME = 1000 * 60 * 10;

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

const fetchTrendingGifs = async (): Promise<GifImageModel[]> => {
  const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
    api_key: API_KEY,
    limit: `${DEFAULT_FETCH_COUNT}`,
    rating: 'g'
  });

  return fetchGifs(url);
};

export const gifAPIService = {
  /**
   * 트렌딩 gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   */
  getTrending: async (): Promise<GifImageModel[]> => {
    return apiCallWithCache({
      queryKey: GIF_KEYS.trending,
      queryFn: fetchTrendingGifs,
      staleTime: TRENDING_STALE_TIME
    });
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
