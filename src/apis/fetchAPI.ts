interface CacheOption {
  key: string;
  fetchFn: CallableFunction;
  staleTime: number;
}

export const cacheStore: Record<string, { data: any; fetchTime: number }> = {};

export const fetchAPI = async (endpoint: RequestInfo | URL, option?: RequestInit) => {
  const response = await fetch(endpoint, option);

  const data = await response.json();

  return data;
};

export const fetchAPIwithCache = async ({ key, fetchFn, staleTime }: CacheOption) => {
  const currentTime = new Date().getTime();

  if (cacheStore[key] && cacheStore[key].fetchTime + staleTime > currentTime) {
    return cacheStore[key].data;
  }

  const data = await fetchFn();

  cacheStore[key] = {
    data,
    fetchTime: currentTime
  };

  return data;
};
