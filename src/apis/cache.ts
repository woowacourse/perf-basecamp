const cacheStorage = new Map<string, unknown>();

const cache = async <T>(key: string, apiRequestCallback: () => Promise<T>): Promise<T> => {
  if (cacheStorage.has(key)) return cacheStorage.get(key) as T;

  const response = await apiRequestCallback();
  cacheStorage.set(key, response);
  return response;
};

export default cache;
