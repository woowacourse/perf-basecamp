// 캐시 추가 함수 (현재 시각 저장)
async function addToCache(cacheName: string) {
  const cache = await caches.open(cacheName);
  const currentDate = new Date().toISOString(); // 현재 시각을 ISO 문자열로 저장

  const request = new Request('/trending-api-time', { method: 'GET' });
  const response = new Response(currentDate, {
    headers: { 'Content-Type': 'text/plain' }
  });

  await cache.put(request, response); // 캐시에 현재 시각을 저장
}

// 캐시 업데이트 함수 (현재 시각으로 갱신)
async function updateToCache(cacheName: string) {
  const cache = await caches.open(cacheName);
  const currentDate = new Date().toISOString(); // 현재 시각을 ISO 문자열로 저장

  const request = new Request('/trending-api-time', { method: 'GET' });
  const response = new Response(currentDate, {
    headers: { 'Content-Type': 'text/plain' }
  });

  await cache.put(request, response); // 캐시된 시간 갱신
}

// 캐시 관리 함수
export async function manageTrendingGifCache(maxAgeInSeconds: number): Promise<RequestCache> {
  const cacheName = 'trendingGif';
  const cache = await caches.open(cacheName);
  const request = new Request('/trending-api-time', { method: 'GET' });

  // 캐시에서 기존 데이터를 가져옴
  const cachedResponse = await cache.match(request);

  if (!cachedResponse) {
    // 캐시가 없다면 addToCache로 캐시 시간 추가
    await addToCache(cacheName);
    return 'default';
  }

  // 캐시가 있다면 해당 캐시의 시간을 확인
  const cachedTime = await cachedResponse.text(); // 캐시된 시간을 가져옴 (ISO 문자열)
  const cachedDate = new Date(cachedTime); // Date 객체로 변환
  const currentDate = new Date(); // 현재 시각

  // 캐시가 max-age 이내에 있는지 확인
  const timeDiffInSeconds = (currentDate.getTime() - cachedDate.getTime()) / 1000; // 현재 시간과 캐시된 시간의 차이 (초 단위)

  if (timeDiffInSeconds >= maxAgeInSeconds) {
    // max-age를 초과했으므로 fetch 실행 후 캐시 업데이트
    await updateToCache(cacheName); // 캐시 시간 업데이트
    return 'default';
  }
  // 만료되지 않은 캐시가 있는 상황
  return 'force-cache';
}
