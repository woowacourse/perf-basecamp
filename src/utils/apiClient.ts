export class ApiError extends Error {
  constructor(
    public status: number,
    message?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const cachePromise = caches.open('api-cache');

export const apiClient = {
  fetchWithCache: async <T>(url: URL): Promise<T> => {
    const cache = await cachePromise;
    const result = await cache.match(url);
    console.log(result);
    if (result === undefined) {
      await cache.add(url);
    }
    const response = await cache.match(url);
    const data = await response?.json();
    return data as T;
  },
  fetch: async <T>(url: URL): Promise<T> => {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
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
