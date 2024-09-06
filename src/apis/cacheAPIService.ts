import { gifAPIService } from './gifAPIService';

export const CACHE_KEY = {
  TRENDING: 'TRENDING'
} as const;

const HEADER_FETCH_DATE = 'fetch-date';
const ONE_DAY_MILISECOND = 60 * 60 * 24 * 1000;

class CacheAPIService {
  static async getTrendingCacheGifs(cacheKey: keyof typeof CACHE_KEY) {
    const cache = await caches.open(cacheKey);
    const cacheResponse = await caches.match(CACHE_KEY[cacheKey]);

    if (cacheResponse && !this.isCacheExpired(cacheResponse)) {
      return await cacheResponse.json();
    }

    cache.delete(cacheKey);
    return await this.getFetchResponseAndCache(cacheKey, cache);
  }

  static async getFetchResponseAndCache(cacheKey: keyof typeof CACHE_KEY, cache: Cache) {
    const fetchResponse = await gifAPIService.getTrending();

    const jsonResponse = new Response(JSON.stringify(fetchResponse), {
      headers: { 'Content-Type': 'application/json' }
    });

    const responseWithDate = await this.putCacheTime(jsonResponse);

    // 캐시에 저장
    await cache.put(cacheKey, responseWithDate);

    return fetchResponse;
  }

  static async putCacheTime(fetchResponse: Response) {
    const cloneResponse = fetchResponse.clone();
    const newBody = await cloneResponse.blob();
    let newHeaders = new Headers(cloneResponse.headers);
    newHeaders.append(HEADER_FETCH_DATE, new Date().toISOString());

    return new Response(newBody, {
      status: cloneResponse.status,
      statusText: cloneResponse.statusText,
      headers: newHeaders
    });
  }

  private static isCacheExpired(cacheResponse: Response) {
    const fetchDate = new Date(cacheResponse.headers.get(HEADER_FETCH_DATE)!).getTime();
    const today = new Date().getTime();

    return today - fetchDate > ONE_DAY_MILISECOND;
  }
}

export default CacheAPIService;
