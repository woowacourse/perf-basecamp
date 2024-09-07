import { CacheManager } from './CacheManager';

export class ApiError extends Error {
  constructor(public status: number, message?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  fetch: async <T>(url: URL): Promise<T> => {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  fetchWithCache: async <T>(
    url: URL,
    cacheKeys: string[],
    staleTime: number = 60 * 60 * 24 * 365 // 1 year
  ): Promise<T> => {
    const cacheManager = new CacheManager('api-cache');
    await cacheManager.init();

    const cacheKey = `${url.toString()}, ${cacheKeys.sort().join('&')}`;
    const cachedData = await cacheManager.getCachedData(cacheKey, staleTime);
    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    await cacheManager.cacheResponse(cacheKey, response);

    return response.json();
  },

  appendSearchParams: (url: URL, params: Record<string, string>): URL => {
    const newUrl = new URL(url.toString());
    Object.entries(params).forEach(([key, value]) => {
      newUrl.searchParams.append(key, value);
    });
    return newUrl;
  }
};
