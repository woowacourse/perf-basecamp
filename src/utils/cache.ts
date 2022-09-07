import { GifsResult } from '@giphy/js-fetch-api';

interface cacheStorageInterface {
  [key: string]: GifsResult;
}

const cacheStorage: cacheStorageInterface = {};

const cache = async (key: string, apiCallback: () => Promise<GifsResult>) => {
  if (cacheStorage[key]) {
    return cacheStorage[key];
  }

  const response = await apiCallback();
  cacheStorage[key] = response;

  return response;
};

export default cache;
