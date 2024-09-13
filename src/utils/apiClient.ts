import cache from './cache';

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

  appendSearchParams: (url: URL, params: Record<string, string>): URL => {
    const newUrl = new URL(url.toString());
    Object.entries(params).forEach(([key, value]) => {
      newUrl.searchParams.append(key, value);
    });
    return newUrl;
  }
};

interface ApiClientWithCacheArgs<T> {
  queryFn: () => Promise<T>;
  queryKey: string;
  staleTime: number;
}

export const apiClientWithCache = async <T>({
  queryFn,
  queryKey,
  staleTime
}: ApiClientWithCacheArgs<T>) => {
  const cachedData = cache.get<T>(queryKey);

  if (cachedData && cache.isValidCache(queryKey)) return cachedData;

  const newData = await queryFn();
  cache.set(queryKey, newData, staleTime);

  return newData;
};
