const cacheData = new Map();

export const cacheApi = async (api: string, key: string) => {
  if (cacheData.has(key)) {
    return cacheData.get(key);
  }

  await fetch(api).then((res) => cacheData.set(key, res.json()));

  return cacheData.get(key);
};
