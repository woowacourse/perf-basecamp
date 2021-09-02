export const memoizePromise = (() => {
  const cache = new Map();

  return (key, callback) => async () => {
    if (!cache.has(key)) {
      const value = (await callback?.()) || callback;

      cache.set(key, value);
    }

    return cache.get(key);
  };
})();
