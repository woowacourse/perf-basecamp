const cacheStorage: { [key: string]: unknown } = {};

const caching = <T>(storageKey: string, apiFunc: Function, cacheTime: number) => {
  if (cacheStorage[storageKey]) {
    return cacheStorage[storageKey] as T;
  }

  const response = apiFunc() as T;
  cacheStorage[storageKey] = response;

  setTimeout(() => {
    delete cacheStorage[storageKey];
  }, cacheTime);

  return response;
};

export default caching;
