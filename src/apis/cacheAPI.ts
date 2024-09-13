const CACHE_NAME = 'giphy-cache';
const CACHE_DURATION = 1000 * 60 * 15;

// 캐시에서 데이터를 가져오고 만료 시간을 확인하는 함수
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(key);

  if (!cachedResponse) return null;

  const data = await cachedResponse.json();
  const { timestamp, cachedData } = data;

  // 캐시가 유효한지 확인
  const isCacheValid = Date.now() - timestamp < CACHE_DURATION;
  if (isCacheValid) {
    return cachedData as T; // 제네릭 타입으로 반환
  } else {
    await cache.delete(key);
    return null;
  }
};

// 데이터를 캐시에 저장하는 함수
export const cacheData = async <T>(key: string, data: T): Promise<void> => {
  const cache = await caches.open(CACHE_NAME);
  const dataToCache = {
    timestamp: Date.now(),
    cachedData: data
  };
  const response = new Response(JSON.stringify(dataToCache));
  await cache.put(key, response);
};

export const getCacheDataOrFetch = async <T>(
  key: string,
  fetchCallback: () => Promise<T>
): Promise<T> => {
  const cachedData = await getCachedData<T>(key);

  if (cachedData) return cachedData;

  const freshData = await fetchCallback();

  await cacheData(key, freshData);

  return freshData;
};
