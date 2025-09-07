const cache: Record<string, { value: any; expiry: number }> = {};

export const saveInCache = (key: string, value: any, ttl: number) => {
  cache[key] = {
    value,
    expiry: Date.now() + ttl
  };
};

export const getFromCache = (key: string) => {
  const cachedData = cache[key];
  if (!cachedData) return null;

  if (Date.now() > cachedData.expiry) {
    delete cache[key];
    return null;
  }

  return cachedData.value;
};
