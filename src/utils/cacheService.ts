import { GifImageModel } from '../models/image/gifImage';

const TRENDING_CACHE_EXPIRY = 10 * 60 * 1000;
const CACHE_NAME = 'gif-cache';
const DB_NAME = 'GifDatabase';
const STORE_NAME = 'trendingGifs';

interface CachedData {
  gifs: GifImageModel[];
  timestamp: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(STORE_NAME);
    };
  });
};

export const cacheService = {
  async getTrendingCache(): Promise<GifImageModel[] | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('trending');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const cachedData = request.result as CachedData | undefined;
        if (cachedData && Date.now() - cachedData.timestamp < TRENDING_CACHE_EXPIRY) {
          resolve(cachedData.gifs);
        } else {
          resolve(null);
        }
      };
    });
  },

  async setTrendingCache(gifs: GifImageModel[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ gifs, timestamp: Date.now() }, 'trending');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  },

  async cacheResponse(url: string, data: GifImageModel[]): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(data));
    await cache.put(url, response);
  },

  async getCachedResponse(url: string): Promise<GifImageModel[] | null> {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(url);
    if (response) {
      return response.json();
    }
    return null;
  }
};
