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

const convertResponseToModel = (gifList: IGif[]): GifImageModel[] => {
  return gifList.map(({ id, title, images }) => {
    // 카드 표시 크기는 280x280이다. original(평균 337px, 28.19MB/16개)을 받을 이유가 없고,
    // GIPHY가 변형마다 제공하는 webp URL을 쓰면 같은 해상도에서 용량이 크게 줄어든다.
    // fixed_width.webp: 200px, 3.06MB/16개 (original 대비 -89%)
    const fixedWidth = images.fixed_width;

    return {
      id,
      title: title ?? '',
      imageUrl: fixedWidth.webp ?? fixedWidth.url ?? images.original.url
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

// Search 페이지를 떠나면 컴포넌트가 언마운트되어 state가 사라지고,
// 재진입 시 useEffect가 다시 실행되어 trending을 매번 새로 요청하고 있었다.
// GIPHY 응답에는 Cache-Control 헤더가 없어 HTTP 캐시로는 해결되지 않으므로
// 컴포넌트 생명주기 바깥(모듈 스코프)에 결과를 보관한다.
// 진행 중인 요청도 함께 보관해 동시 호출이 중복 요청으로 이어지지 않게 한다.
let trendingCache: Promise<GifImageModel[]> | null = null;

export const gifAPIService = {
  /**
   * treding gif 목록을 가져옵니다.
   * 최초 1회만 네트워크 요청하고 이후에는 메모이제이션된 결과를 반환합니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async (): Promise<GifImageModel[]> => {
    if (trendingCache) return trendingCache;

    const url = apiClient.appendSearchParams(new URL(`${BASE_URL}/trending`), {
      api_key: API_KEY,
      limit: `${DEFAULT_FETCH_COUNT}`,
      rating: 'g'
    });

    trendingCache = fetchGifs(url).catch((error) => {
      // 실패한 결과를 캐시에 남기면 이후 진입에서 영구히 실패하므로 되돌린다.
      trendingCache = null;
      throw error;
    });

    return trendingCache;
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
