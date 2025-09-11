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
const TRENDING_GIF_API = apiClient
  .appendSearchParams(new URL(`${BASE_URL}/trending`), {
    api_key: API_KEY,
    limit: `${DEFAULT_FETCH_COUNT}`,
    rating: 'g'
  })
  .toString();

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
  getTrending: async (): Promise<GifImageModel[]> => {
    try {
      const cacheStorage = await caches.open('trending');
      const cachedResponse = await cacheStorage.match(TRENDING_GIF_API);

      if (cachedResponse) {
        const gifs: GifsResult = await cachedResponse.json();
        return convertResponseToModel(gifs.data);
      }

      const response = await fetch(TRENDING_GIF_API);

      if (response.ok) {
        await cacheStorage.put(TRENDING_GIF_API, response.clone());
        const gifs: GifsResult = await response.json();
        return convertResponseToModel(gifs.data);
      } else {
        throw new Error('네트워크 요청 실패!');
      }
    } catch (e) {
      console.error('getTrending error:', e);
      return [];
    }
  },

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
