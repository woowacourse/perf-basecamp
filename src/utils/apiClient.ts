export class ApiError extends Error {
  constructor(public status: number, message?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiClientFetchParams {
  url: URL;
  method?: string;
  cache?: RequestCache;
}

export const apiClient = {
  fetch: async <T>({
    url,
    method = 'GET',
    cache = 'default'
  }: ApiClientFetchParams): Promise<T> => {
    const response = await fetch(url.toString(), {
      method,
      cache
    });
    console.log('cache', cache);
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
