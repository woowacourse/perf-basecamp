const cacheStorage: Record<string, { expiredTime: Date; response: unknown }> = {};

const cache = <T>(key: string, apiCallFunc: () => T): T => {
  const expiredTime = new Date();

  if (cacheStorage[key] && cacheStorage[key].expiredTime >= expiredTime) {
    return cacheStorage[key].response as T;
  }

  const response = apiCallFunc();
  expiredTime.setHours(expiredTime.getHours() + 1);
  cacheStorage[key] = { expiredTime, response };

  return response;
};

export default cache;
