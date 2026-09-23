import type { GifsResult } from '@giphy/js-fetch-api';
import type { IGif } from '@giphy/js-types';

import { GifImageModel } from '../types/gifImage';
import { apiClient, ApiError } from '../utils/apiClient';
import { API_KEY, BASE_URL, DEFAULT_FETCH_COUNT, TRENDING_URL } from './giphyConfig';

if (API_KEY === '') {
  throw new Error('GIPHY_API_KEY is not set in environment variables');
}

const TRENDING_CACHE_TTL = 30 * 60 * 1000;
let trendingRequest: Promise<GifImageModel[]> | undefined;
let trendingExpiresAt = 0;

const convertResponseToModel = (gifList: IGif[]): GifImageModel[] => {
  return gifList.map(({ id, title, images, is_sticker: isSticker }) => {
    return {
      id,
      title: title ?? '',
      imageUrl: images.fixed_width?.webp ?? images.fixed_width?.url ?? images.original.url,
      posterUrl: images.fixed_width_still?.url ?? images.original_still?.url,
      // Stickers need transparency, which the MP4 rendition does not preserve.
      videoUrl: isSticker ? undefined : images.fixed_width?.mp4
    };
  });
};

const fetchGifs = async (
  url: URL,
  prefetchedResponse?: Promise<Response>
): Promise<GifImageModel[]> => {
  try {
    let gifs: GifsResult;
    if (prefetchedResponse !== undefined) {
      const response = await prefetchedResponse;
      if (!response.ok) {
        throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
      }
      gifs = await response.json();
    } else {
      gifs = await apiClient.fetch<GifsResult>(url);
    }

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

    const url = new URL(TRENDING_URL);
    const earlyRequest = typeof window === 'undefined' ? undefined : window.memegleTrendingRequest;
    const prefetchedResponse = earlyRequest?.url === url.href ? earlyRequest.response : undefined;
    if (earlyRequest !== undefined) delete window.memegleTrendingRequest;

    // Pending requests do not expire; the TTL starts after a successful response.
    trendingExpiresAt = Infinity;
    trendingRequest = fetchGifs(url, prefetchedResponse)
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
