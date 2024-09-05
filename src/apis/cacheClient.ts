import { GifsResult } from '@giphy/js-fetch-api';
import { convertResponseToModel } from './gifAPIService';

const cacheName = `perf-cache`;

export const cacheClient = {
  read: async (url: URL) => {
    // cache 를 열어 해당 URL과 매칭되는 response를 가져온다.
    const cache = await caches.open(cacheName);
    const cacheResponse = await cache.match(url);

    // cacheResponse 있으면 해당 응답을 반환한다.
    if (cacheResponse) {
      const gifs: GifsResult = await cacheResponse.json();
      return convertResponseToModel(gifs.data);
    }

    // cacheResponse가 없으면 fetch 요청한다.
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('response error');
    }

    // 네트워크 요청 성공 시, 응답을 캐싱하고 반환한다.
    cache.put(url, response.clone());
    const gifs: GifsResult = await response.json();

    return convertResponseToModel(gifs.data);
  }
};
