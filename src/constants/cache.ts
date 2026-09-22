import { CachePolicy } from '../utils/localCache';

const HOUR = 60 * 60 * 1000;

// trending 목록에 실시간성을 제공하지 않기 위한 캐시 설정
// 최신 목록을 의도적으로 보여줘야 한다면 version을 업데이트하여 재배포
export const TRENDING_CACHE_POLICY: CachePolicy = {
  key: 'gif:trending',
  version: 'v1',
  ttl: HOUR
};
