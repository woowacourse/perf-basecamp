export const CACHE_KEY = {
  TRENDING: 'TRENDING'
} as const;

const HEADER_FETCH_DATE = 'fetch-date';
const ONE_DAY_MILISECOND = 60 * 60 * 24 * 1000;

class CacheAPIService {
  static async getCacheData<T>(url: URL, fetchFunc: () => Promise<T>): Promise<T> {
    const cache = await caches.open(String(url));
    const cacheResponse = await cache.match(url);

    if (cacheResponse && !this.isCacheExpired(cacheResponse)) {
      return cacheResponse.json();
    }

    await cache.delete(url);
    return this.getFetchResponseAndCache(String(url), fetchFunc);
  }

  private static async getFetchResponseAndCache<T>(
    url: string,
    fetchFunc: () => Promise<T>
  ): Promise<T> {
    const cache = await caches.open(url);
    const fetchResponse = await fetchFunc();
    const responseWithDate = await this.createCacheResponse(fetchResponse);

    await cache.put(url, responseWithDate);
    return fetchResponse;
  }

  private static async createCacheResponse<T>(fetchResponse: T): Promise<Response> {
    const jsonResponse = new Response(JSON.stringify(fetchResponse), {
      headers: { 'Content-Type': 'application/json' }
    });

    const cloneResponse = jsonResponse.clone();
    const newHeaders = new Headers(cloneResponse.headers);
    newHeaders.append(HEADER_FETCH_DATE, new Date().toISOString());

    const newBody = await cloneResponse.blob();
    return new Response(newBody, {
      status: cloneResponse.status,
      statusText: cloneResponse.statusText,
      headers: newHeaders
    });
  }

  private static isCacheExpired(cacheResponse: Response): boolean {
    const fetchDate = cacheResponse.headers.get(HEADER_FETCH_DATE);
    if (!fetchDate) return true;

    const fetchTimestamp = new Date(fetchDate).getTime();
    const currentTimestamp = Date.now();

    return currentTimestamp - fetchTimestamp > ONE_DAY_MILISECOND;
  }
}

export default CacheAPIService;
