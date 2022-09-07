const cache = new Map();

const memoizedFetch = async <T>(url: string, key: T) => {
  if (!cache.has(key)) {
    const data = await fetch(url).then((res) => res.json());
    cache.set(key, data);
  }

  return cache.get(key);
};

export default memoizedFetch;
