interface CacheOption {
  key: string;
  fetchFn: CallableFunction;
  staleTime: number;
}

export const cacheStore: Record<string, any> = {};

export const fetchAPI = async (endpoint: RequestInfo | URL, option?: RequestInit) => {
  const response = await fetch(endpoint, option);

  const data = await response.json();

  return data;
};

export const fetchAPIwithCache = async ({ key, fetchFn, staleTime }: CacheOption) => {
  if (cacheStore[key]) {
    return cacheStore[key];
  }

  const data = await fetchFn();

  cacheStore[key] = data;

  setTimeout(() => {
    delete cacheStore[key];
  }, staleTime);

  return data;
};
