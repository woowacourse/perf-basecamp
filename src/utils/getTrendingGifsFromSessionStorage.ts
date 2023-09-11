import { isGifImageModels } from '../models/image/gifImage';
import { TRENDING_GIFS_KEY } from '../constants/sessionStorageKeys';

/**
 * trending gif 목록을 session storage에서 가져옵니다.
 * 만약 저장된 trending gif가 없거나, 유효하지 않은 값이 저장되어 있을 경우에는 빈 배열을 반환합니다.
 * @returns {GifImageModel[]}
 */
export const getTrendingGifsFromSessionStorage = () => {
  try {
    const trendingGifs = JSON.parse(sessionStorage.getItem(TRENDING_GIFS_KEY) ?? '');

    if (isGifImageModels(trendingGifs)) {
      return trendingGifs;
    }

    return [];
  } catch (e) {
    return [];
  }
};
