type QueryCacheEntry<T> = {
  data?: T;
  updatedAt: number;
  promise?: Promise<T>;
};

const queryCache = new Map<string, QueryCacheEntry<unknown>>();

export const getQueryData = <T>(queryKey: string): T | undefined => {
  return queryCache.get(queryKey)?.data as T | undefined;
};

export const fetchQuery = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  staleTime: number
): Promise<T> => {
  const cachedEntry = queryCache.get(queryKey) as QueryCacheEntry<T> | undefined;

  if (cachedEntry?.data !== undefined && Date.now() - cachedEntry.updatedAt < staleTime) {
    return Promise.resolve(cachedEntry.data);
  }

  if (cachedEntry?.promise) {
    return cachedEntry.promise;
  }

  const entry: QueryCacheEntry<T> = cachedEntry ?? { updatedAt: 0 };
  const promise = queryFn()
    .then((data) => {
      entry.data = data;
      entry.updatedAt = Date.now();
      return data;
    })
    .finally(() => {
      entry.promise = undefined;
    });

  entry.promise = promise;
  queryCache.set(queryKey, entry);

  return promise;
};
