const cacheStorage: Record<string, unknown> = {};

export const cache = async <T>(key: string, fetch: () => T): Promise<T> => {
  if (cacheStorage[key]) {
    return cacheStorage[key] as T;
  }

  const response = await fetch();
  cacheStorage[key] = response;

  return response;
};
