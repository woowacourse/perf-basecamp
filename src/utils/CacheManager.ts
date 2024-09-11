/**
 * CacheManager 클래스는 Cache Storage를 관리하며 데이터를 캐싱하고
 * 캐시된 데이터를 반환하거나 초기화하는 기능을 제공합니다.
 *
 * 사용하기 전에 반드시 init() 메서드를 호출하여 Cache Storage를 초기화해야 합니다.
 */
export class CacheManager {
  private cacheStorage!: Cache;

  private name: string;

  constructor(storageName: string) {
    this.name = storageName;
  }

  async init() {
    this.cacheStorage = await caches.open(this.name);
  }

  async getCachedData(cacheKey: string, staleTime: number) {
    const cachedResponse = await this.cacheStorage.match(cacheKey);
    if (!cachedResponse) return null;

    const timestamp = Number(cachedResponse.headers.get('X-Timestamp'));
    const now = Date.now();
    const isExpired = now - timestamp > staleTime * 1000;

    if (isExpired) {
      await this.cacheStorage.delete(cacheKey);
      return null;
    }

    return await cachedResponse.json();
  }

  async cacheResponse(cacheKey: string, response: Response): Promise<void> {
    const clonedResponse = response.clone();

    const headers = new Headers(clonedResponse.headers);
    headers.append('X-Timestamp', Date.now().toString());

    const newResponse = new Response(clonedResponse.body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: headers
    });

    await this.cacheStorage.put(cacheKey, newResponse);
  }

  async clearCache() {
    await caches.delete(this.name);
  }
}
