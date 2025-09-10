import { createApiCache } from './apiCache';

// GIF 전용 캐시 인스턴스 생성
export const gifCache = createApiCache({
  defaultTTL: 10 * 60 * 1000, // 10분 (GIF는 더 오래 캐시)
  maxSize: 30, // GIF 데이터가 크므로 적은 수만 캐시
  sessionStoragePrefix: 'gif-cache-'
});
