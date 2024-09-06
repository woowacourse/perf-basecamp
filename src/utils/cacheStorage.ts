import { GifImageModel } from '../models/image/gifImage';

const cacheVersion = 'v1';
const cacheName = `sick-cache-${cacheVersion}`;

class LocalCache {
  static EXPIRE_TIME = 5 * 60 * 1000; // 하루

  async writeToCache(
    key: string,
    data: GifImageModel[],
    expireTime: number = LocalCache.EXPIRE_TIME
  ) {
    try {
      const cache = await caches.open(cacheName);
      const expired = new Date().getTime() + expireTime;

      const request = new Request(key);
      const responseData = {
        data,
        expired
      };

      const response = new Response(JSON.stringify(responseData));
      cache.put(request, response);
    } catch (error) {
      console.error('데이터 캐싱 중 오류가 발생했습니다:', error);
    }
  }

  async readFromCache(key: string) {
    try {
      const cache = await caches.open(cacheName);
      const response = await cache.match(key);

      if (!response) return [];

      const responseData = await response.json();
      const now = new Date().getTime();

      if (now > responseData.expired) {
        cache.delete(key);
        return [];
      }

      return responseData.data || [];
    } catch (error) {
      console.error('캐싱 데이터를 읽는 도중 오류가 발생했습니다:', error);
      return [];
    }
  }
}

const localCache = new LocalCache();
export default localCache;
