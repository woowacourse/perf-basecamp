export class ApiError extends Error {
  constructor(public status: number, message?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간

export const apiClient = {
  fetch: async <T>(url: URL): Promise<T> => {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  appendSearchParams: (url: URL, params: Record<string, string>): URL => {
    const newUrl = new URL(url.toString());
    Object.entries(params).forEach(([key, value]) => {
      newUrl.searchParams.append(key, value);
    });
    return newUrl;
  },

  fetchWithCache: async <T>(url: URL, cacheName: string): Promise<T> => {
    const cache = await caches.open(cacheName);

    const cachedResponse = await cache.match(url.toString());
    if (cachedResponse) {
      // 사용자 정의 헤더인 X-Cached-At을 통해 캐시된 시간을 확인 (`X-` 접두사 -> 관행)
      // 0 -> 캐시 시간이 없는 경우 가장 오래된 날짜를 사용하여 항상 만료된 것으로 처리
      const cachedDate = new Date(cachedResponse.headers.get('X-Cached-At') || 0);
      if (Date.now() - cachedDate.getTime() < CACHE_DURATION) {
        return cachedResponse.json();
      }
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }

    const clonedResponse = response.clone();

    // 현재 시간을 추가한 새로운 Response 객체 생성
    const responseToCache = new Response(clonedResponse.body, {
      status: clonedResponse.status,
      statusText: clonedResponse.statusText,
      headers: (() => {
        const headers = new Headers(clonedResponse.headers);
        headers.set('X-Cached-At', new Date().toISOString());
        return headers;
      })()
    });

    // 캐시에 저장, 원본은 반환
    await cache.put(url.toString(), responseToCache);
    return response.json();
  }
};
