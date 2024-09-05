import { cache } from './cache';

interface ApiCallWithCacheOptions<T, K extends readonly string[]> {
  queryKey: K;
  queryFn: () => Promise<T>;
  staleTime: number;
}

const QUERY_KEY_SEPARATOR = ',';

const apiCallWithCache = async <T, K extends readonly string[]>({
  queryKey,
  queryFn,
  staleTime
}: ApiCallWithCacheOptions<T, K>): Promise<T> => {
  const cacheKey = queryKey.join(QUERY_KEY_SEPARATOR);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const data = await queryFn();
  cache.set(cacheKey, data, staleTime);
  return data;
};

export default apiCallWithCache;
