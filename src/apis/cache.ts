const cacheStorage = new Map();

export const cache = async <T>(key: string, apiRequestCallback: () => Promise<T>): Promise<T> => {
  if (cacheStorage.has(key)) return cacheStorage.get(key);

  const response = await apiRequestCallback();
  cacheStorage.set(key, response);
  return response;
};
