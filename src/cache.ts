const cacheStorage: Record<string, unknown> = {};

export const cache = (cacheKey: string, fetcher: Function) => {
  if (cacheStorage[cacheKey]) {
    return cacheStorage[cacheKey];
  }

  const response = fetcher();
  cacheStorage[cacheKey] = response;

  return response;
};
