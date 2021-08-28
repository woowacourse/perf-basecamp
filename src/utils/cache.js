const cached = new Map();

// eslint-disable-next-line import/prefer-default-export
export const cacheAsync =
  (fn, key) =>
  (...args) =>
    cached.has(key)
      ? Promise.resolve(cached.get(key))
      : fn(...args).then((data) => {
          cached.set(key, data);

          return data;
        });
