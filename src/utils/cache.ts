import { GifsResult } from '@giphy/js-fetch-api';

const cacheStorage: { [key: string]: GifsResult } = {};

const caching = (storageKey: string, apiFunc: Function, cacheTime: number) => {
  if (cacheStorage[storageKey]) {
    return cacheStorage[storageKey];
  }

  const response = apiFunc();
  cacheStorage[storageKey] = response;

  setTimeout(() => {
    delete cacheStorage[storageKey];
  }, cacheTime);

  return response;
};

export default caching;
