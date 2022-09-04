type CacheStorage = {
  cache: Record<string, unknown>;
  invalidateCache: (key: string) => void;
  isCacheValid: (key: string) => boolean;
};

const cacheStorage: CacheStorage = {
  cache: {},
  invalidateCache: function (key: string) {
    delete this.cache[key];
  },
  isCacheValid: function (key: string) {
    return Object.prototype.hasOwnProperty.call(this.cache, key);
  }
};

export const cache = async <Response>(
  key: string,
  asyncFetchFn: () => Response
): Promise<Response> => {
  let data;

  if (cacheStorage.isCacheValid(key)) {
    data = cacheStorage.cache[key] as Response;
  } else {
    data = await asyncFetchFn();
    cacheStorage.cache[key] = data;
  }

  return data;
};
