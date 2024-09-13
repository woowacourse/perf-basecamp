import { GifsResult } from '@giphy/js-fetch-api';
import { convertResponseToModel } from './gifAPIService';

const cacheName = `perf-cache`;

const EXPIRED_TIME = 30 * 1000; // 30초
const EXPIRED_TIME_KEY = 'expiredTime';

export const cacheClient = {
  read: async (url: URL) => {
    // cache 를 열어 해당 URL과 매칭되는 response를 가져온다.
    const cache = await caches.open(cacheName);
    const cacheResponse = await cache.match(url);

    // cacheResponse 있으면 해당 응답을 반환한다.
    if (cacheResponse) {
      // 만료된 경우, 캐시를 삭제하고 새로운 fetch 요청을 보낸다.
      if (cacheClient.isCacheExpired(cacheResponse)) {
        cache.delete(url);
        return await cacheClient.requestNewResource(url);
      }

      const gifs: GifsResult = await cacheResponse.json();
      return convertResponseToModel(gifs.data);
    }

    // cacheResponse가 없으면 fetch 요청한다.
    return await cacheClient.requestNewResource(url);
  },

  write: async (url: URL, response: Response) => {
    try {
      const cache = await caches.open(cacheName);
      const cacheResponse = await cacheClient.getFetchResponse(response);
      cache.put(url, cacheResponse);
    } catch (error) {
      console.error('데이터 캐싱 중 오류가 발생했습니다:', error);
    }
  },

  requestNewResource: async (url: URL) => {
    // cacheResponse가 없으면 fetch 요청한다.
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('response error');
    }

    // 네트워크 요청 성공 시, 응답을 캐싱하고 반환한다.
    await cacheClient.write(url, response);
    const gifs: GifsResult = await response.json();

    return convertResponseToModel(gifs.data);
  },

  // header에 EXPIRED_TIME_KEY로 현재 시간 추가 후 Response 반환
  getFetchResponse: async (response: Response) => {
    const cloneResponse = response.clone();
    const newBody = await cloneResponse.blob();
    const newHeaders = new Headers(cloneResponse.headers);
    newHeaders.append(EXPIRED_TIME_KEY, new Date().toISOString());

    return new Response(newBody, {
      status: cloneResponse.status,
      statusText: cloneResponse.statusText,
      headers: newHeaders
    });
  },

  // 현재 시각과 header에 추가한 시각을 비교하여 만료되었는지 체크
  isCacheExpired: (cacheResponse: Response) => {
    const fetchDate = new Date(cacheResponse.headers.get(EXPIRED_TIME_KEY)!).getTime();
    const today = new Date().getTime();

    return today - fetchDate > EXPIRED_TIME;
  }
};
