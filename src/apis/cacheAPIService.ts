const cacheOptions = {
  expiration: 60 * 6 //1시간
};

export const cacheAPIService = {
  fetchCachedResponse: async function (cacheKey: string, url: string) {
    const cache = await caches.open(cacheKey);
    const cacheResponse = await caches.match(url);

    return cacheResponse && !this.isExpired(cacheResponse)
      ? await cacheResponse.json()
      : await this.fetchResponse(cache, url);
  },

  fetchResponse: async function (cache: Cache, url: string) {
    const fetchResponse = await fetch(url);
    const expiresHeader = new Headers({
      Expires: new Date(Date.now() + cacheOptions.expiration * 1000).toUTCString()
    });
    const updatedResponse = new Response(fetchResponse.body, { headers: expiresHeader });

    cache.put(url, updatedResponse.clone());

    return fetchResponse.json();
  },

  isExpired(response: Response) {
    const expiresHeader = response.headers.get('Expires');

    if (!expiresHeader) return false;

    const expiresDate = new Date(expiresHeader);

    return expiresDate <= new Date(Date.now());
  }
};
