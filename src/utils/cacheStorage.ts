const cacheVersion = 'v1';
const cacheName = `sick-cache-${cacheVersion}`;

class LocalCache<T> {
  // 기본 캐싱 시간 (하루)
  static DEFAULT_EXPIRE_TIME = 24 * 60 * 60 * 1000;
  private expireTime: number;

  constructor(expireTime: number = LocalCache.DEFAULT_EXPIRE_TIME) {
    this.expireTime = expireTime;
  }

  async writeToCache(key: string, data: T, expireTime: number = this.expireTime) {
    try {
      const cache = await caches.open(cacheName);
      const expired = new Date().getTime() + expireTime;

      const request = new Request(key);
      const responseData = {
        data,
        expired
      };

      const response = new Response(JSON.stringify(responseData));
      await cache.put(request, response);
    } catch (error) {
      console.error('데이터 캐싱 중 오류가 발생했습니다:', error);
    }
  }

  async readFromCache(key: string): Promise<T | []> {
    try {
      const cache = await caches.open(cacheName);
      const response = await cache.match(key);

      if (!response) return [];

      const responseData = await response.json();
      const now = new Date().getTime();

      if (now > responseData.expired) {
        await cache.delete(key);
        return [];
      }

      return responseData.data || [];
    } catch (error) {
      console.error('캐싱 데이터를 읽는 도중 오류가 발생했습니다:', error);
      return [];
    }
  }
}

export default LocalCache;
