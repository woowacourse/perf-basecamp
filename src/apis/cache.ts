const cache = new Map();

export const CACHE_KEYS = {
  TRENDING_GIF: 'trendingGif'
};

const cacheResponse = async <T>(key: string, getAPIResponse: () => Promise<T>): Promise<T> => {
  if (cache.has(key)) {
    if ((Number(new Date()) - cache.get(key).setTime) / 1000 > 60) {
      const response = await getAPIResponse();

      cache.set(key, { response, setTime: Number(new Date()) });
    }
    return cache.get(key).response;
  }

  const response = await getAPIResponse();

  cache.set(key, { response, setTime: Number(new Date()) });

  return cache.get(key).response;
};

export default cacheResponse;
