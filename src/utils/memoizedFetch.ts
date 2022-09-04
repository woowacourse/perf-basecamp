const cache = new Map();

const memoizedFetch = async (url: string, key: string) => {
  if (!cache.has(key)) {
    const data = await fetch(url).then((res) => res.json());
    cache.set(key, data);
  }

  return cache.get(key);
};

export default memoizedFetch;
