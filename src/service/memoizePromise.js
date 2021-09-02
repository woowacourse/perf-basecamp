const memoizePromise = (() => {
  const cache = new Map();

  return (key, callback) => async () => {
    if (!cache.has(key)) {
      const data = await callback?.();

      cache[key] = data;
    }

    return cache[key];
  };
})();

export default memoizePromise;
