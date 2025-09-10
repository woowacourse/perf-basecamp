import { GifImageModel } from '../models/image/gifImage';

const CACHE_NAME = 'cache-trending';
const ONE_DAY_KEY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const cachingTrending = async (fetcher: () => Promise<GifImageModel[]>) => {
  const cache = await caches.open(CACHE_NAME);
  const request = new Request(`/trending?day=${ONE_DAY_KEY}`);

  // 1. 캐시 있으면 바로 리턴
  const hit = await cache.match(request);
  if (hit) return hit.json();

  // 2. 없으면 네트워크 → 캐시에 저장 후 return
  const data = await fetcher();

  await cache.put(
    request,
    new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  );
  return data;
};

export default cachingTrending;
