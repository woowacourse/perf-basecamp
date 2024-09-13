import { GifImageModel } from '../../../models/image/gifImage';

const useCacheStorage = () => {
  const REQUEST_URL = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=16&rating=g`;

  const getCache = async (): Promise<GifImageModel[] | null> => {
    const cacheStorage = await caches.open('trending');
    const cachedResponse = await cacheStorage.match(REQUEST_URL);

    try {
      if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        return cachedData;
      }

      return null;
    } catch (error) {
      console.error('캐시 데이터를 불러오는 중 에러 발생:', error);
      return null;
    }
  };

  const setCache = async (data: GifImageModel[]) => {
    const cacheStorage = await caches.open('trending');

    const response = new Response(JSON.stringify([...data]));
    await cacheStorage.put(REQUEST_URL, response);
  };

  return {
    getCache,
    setCache
  };
};

export default useCacheStorage;
