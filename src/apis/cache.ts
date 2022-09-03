const cacheStorage: Record<string, unknown> = {};

const cache = <T>(key: string, apiCallFunc: () => T): T => {
  if (cacheStorage[key]) {
    return cacheStorage[key] as T;
  }

  const response = apiCallFunc();
  cacheStorage[key] = response;

  return response;
};

export default cache;
