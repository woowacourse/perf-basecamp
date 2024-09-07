export const openCacheStorage = async () => {
  const storage = await window.caches.open('storage');
  return storage;
};

export const putData = async (key: string, response: Response) => {
  const storage = await openCacheStorage();
  storage.put(key, response);
};

export const checkExistCachingData = async (key: string) => {
  const storage = await openCacheStorage();
  return storage.match(key);
};

export const apiCallWithCache = async <T>(key: string, apiCallFunction: () => Promise<T>) => {
  const isExistCachingData = await checkExistCachingData(key);

  // 캐싱 데이터가 있는경우 캐시된 데이터를 반환
  if (isExistCachingData) {
    const data = (await isExistCachingData.json()) as T;
    return data;
  }

  // 없을경우 api 호출을 한 뒤에 캐시 데이터에 넣는다.
  const data = await apiCallFunction();
  const response = new Response(JSON.stringify(data));
  await putData(key, response);

  return data as T;
};
