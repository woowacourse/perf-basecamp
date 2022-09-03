type cacheData = Record<string, Response>;

const cacheStore: cacheData = {};

/**
 * 요청한 데이터를 캐싱하는 함수입니다.
 * inspired from react-query
 * @author usageness <kyr9389@naver.com>
 * @param {string} targetUrl
 * @returns {Promise<Response>}
 */
export const cacheFetch = async (targetUrl: string): Promise<Response> => {
  if (cacheStore[targetUrl]) return Promise.resolve(cacheStore[targetUrl].clone());

  cacheStore[targetUrl] = await fetch(targetUrl);
  return Promise.resolve(cacheStore[targetUrl].clone());
};
