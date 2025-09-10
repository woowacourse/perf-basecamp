export class ApiError extends Error {
  constructor(public status: number, message?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getCacheData = async <T>(
  cache: Cache,
  key: string
): Promise<{ data: T; expiryDate: number } | null> => {
  const cachedResponse = await cache.match(key);
  if (!cachedResponse) {
    return null;
  }

  return cachedResponse.json();
};

const setCacheData = async <T>(cache: Cache, key: string, data: T, ttl: number): Promise<void> => {
  const expiryDate = Date.now() + ttl;
  const response = new Response(
    JSON.stringify({
      data,
      expiryDate
    })
  );
  await cache.put(key, response);
};

export const apiClient = {
  fetch: async <T>(url: URL): Promise<T> => {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  fetchWithCacheStorage: async <T>(url: URL, cacheName: string): Promise<T> => {
    const cache = await caches.open(cacheName);

    const cached = await getCacheData<T>(cache, url.toString());
    if (cached) {
      if (cached.expiryDate > Date.now()) {
        return cached.data;
      }

      await cache.delete(url.toString());
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    setCacheData(cache, url.toString(), data, 60 * 60 * 1000);

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
