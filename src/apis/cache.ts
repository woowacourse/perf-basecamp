const cache = new Map();

export const CACHE_KEYS = {
  TRENDING_GIF: 'trendingGif'
};

const cacheResponse = async <T>(key: string, getAPIResponse: () => Promise<T>): Promise<T> => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const response = await getAPIResponse();

  cache.set(key, response);

  return cache.get(key);
};

export default cacheResponse;
