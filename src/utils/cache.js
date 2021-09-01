const cacheMap = new Map();

// eslint-disable-next-line import/prefer-default-export
export const cacheAsync =
  (fn, key, cache = cacheMap) =>
  (...args) =>
    cache.has(key)
      ? Promise.resolve(cache.get(key))
      : fn(...args).then((data) => {
          cache.set(key, data);

          return data;
        });
