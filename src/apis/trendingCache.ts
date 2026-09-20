import { GifImageModel } from '../models/image/gifImage';

const CACHE_KEY = 'memegle:trending';
const CACHE_TTL = 1000 * 60 * 60; // 1시간

type CachedTrending = {
  expiresAt: number;
  gifs: GifImageModel[];
};

const isValid = (value: unknown): value is CachedTrending => {
  if (typeof value !== 'object' || value === null) return false;

  const cached = value as Partial<CachedTrending>;

  return typeof cached.expiresAt === 'number' && Array.isArray(cached.gifs);
};

/**
 * 캐시된 trending 목록을 반환한다. 캐시가 없거나 만료되었으면 null을 반환한다.
 *
 * sessionStorage를 사용할 수 없는 환경(프라이빗 모드, 저장 용량 초과 등)에서는
 * 캐시 없이 동작하도록 실패를 삼킨다.
 */
export const readTrendingCache = (): GifImageModel[] | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw === null) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isValid(parsed) || parsed.expiresAt < Date.now()) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsed.gifs;
  } catch {
    return null;
  }
};

export const writeTrendingCache = (gifs: GifImageModel[]): void => {
  try {
    const cached: CachedTrending = { expiresAt: Date.now() + CACHE_TTL, gifs };

    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  } catch {
    // 캐시 저장 실패는 기능에 영향을 주지 않으므로 무시한다.
  }
};
