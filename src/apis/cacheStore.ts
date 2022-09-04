interface CacheProperty {
  cacheData: any;
  staleTime: number;
}

export const cacheStore: { [key: string]: CacheProperty } = {};

export const fetchWithCache =
  (key: string, staleTime: number) =>
  (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    if (cacheStore[key]?.cacheData) {
      return cacheStore[key].cacheData;
    }

    return fetch(input, init).then((res) => {
      cacheStore[key] = {
        cacheData: res,
        staleTime
      };

      setTimeout(() => {
        delete cacheStore[key];
      }, staleTime);

      return res;
    });
  };
