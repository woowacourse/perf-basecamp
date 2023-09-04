import { GifsResult, GiphyFetch, SearchOptions } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

import { GifImageModel } from '../models/image/gifImage';

const apiKey = process.env.GIPHY_API_KEY || '';
const gf = new GiphyFetch(apiKey);

const DEFAULT_FETCH_COUNT = 16;
const TRENDING_GIF_API = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=${DEFAULT_FETCH_COUNT}&rating=g`;

// 캐시 데이터를 저장할 객체
const cache: Record<string, GifImageModel[]> = {};

// 데이터를 캐시하는 유틸리티 함수
function cacheData(key: string, data: GifImageModel[]): void {
  cache[key] = data;
}

// 캐시된 데이터를 반환하는 유틸리티 함수
function getCachedData(key: string): GifImageModel[] | null {
  return cache[key] || null;
}

function convertResponseToModel(gifList: IGif[]): GifImageModel[] {
  return gifList.map((gif) => {
    const { id, title, images } = gif;

    return {
      id,
      title,
      imageUrl: images.original.url
    };
  });
}

export const gifAPIService = {
  getTrending: async function (): Promise<GifImageModel[]> {
    try {
      // 캐시된 데이터를 확인
      const cachedData = getCachedData('trending');

      // 캐시된 데이터가 있으면 캐시된 데이터를 반환
      if (cachedData !== null) {
        return cachedData;
      }

      const gifs: GifsResult = await fetch(TRENDING_GIF_API).then((res) => res.json());
      const gifModels = convertResponseToModel(gifs.data);

      // 데이터를 캐시
      cacheData('trending', gifModels);

      return gifModels;
    } catch (e) {
      return [];
    }
  },

  searchByKeyword: async function (keyword: string, page: number): Promise<GifImageModel[]> {
    const searchOptions: SearchOptions = {
      limit: DEFAULT_FETCH_COUNT,
      lang: 'en',
      offset: page * DEFAULT_FETCH_COUNT
    };

    try {
      const gifs: GifsResult = await gf.search(keyword, searchOptions);
      return convertResponseToModel(gifs.data);
    } catch (e) {
      return [];
    }
  }
};
