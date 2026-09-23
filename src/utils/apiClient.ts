export class ApiError extends Error {
  constructor(public status: number, message?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const CACHE_TTL_BY_PATH: Record<string, number | undefined> = {
  '/v1/gifs/trending': 60 * 60 * 1000
};

interface CacheEntry<T> {
  expiresAt: number;
  data: T;
}

const getCacheKey = (url: URL): string => {
  const cacheUrl = new URL(url);
  cacheUrl.searchParams.delete('api_key');

  return `api-cache:${cacheUrl.pathname}?${cacheUrl.searchParams.toString()}`;
};

export const apiClient = {
  fetch: async <T>(url: URL): Promise<T> => {
    const cacheTTL = CACHE_TTL_BY_PATH[url.pathname];
    const cacheKey = getCacheKey(url);
    const cached = cacheTTL !== undefined ? localStorage.getItem(cacheKey) : null;

    if (cached !== null) {
      const cache = JSON.parse(cached) as CacheEntry<T>;
      if (cache.expiresAt > Date.now()) return cache.data;
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as T;

    if (cacheTTL !== undefined) {
      const cache: CacheEntry<T> = {
        expiresAt: Date.now() + cacheTTL,
        data
      };
      localStorage.setItem(cacheKey, JSON.stringify(cache));
    }

    return data;
  },

  appendSearchParams: (url: URL, params: Record<string, string>): URL => {
    const newUrl = new URL(url.toString());
    Object.entries(params).forEach(([key, value]) => {
      newUrl.searchParams.append(key, value);
    });
    return newUrl;
  }
};
