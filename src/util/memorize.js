const cache = new Map();

export const memorize =
  (fn) =>
  (...args) => {
    const isAsync = fn.constructor.name === "AsyncFunction";

    if (!cache.has(fn)) {
      (async () => {
        const value = isAsync ? await fn(...args) : fn(...args);

        cache.set(fn, value);
      })();
    }

    return cache.get(fn);
  };
