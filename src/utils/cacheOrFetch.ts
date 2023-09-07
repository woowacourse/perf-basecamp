const cacheData: Record<string, unknown> = {};

export const cacheOrFetch = async <T>(key: string, fetchData: () => T): Promise<T> => {
  if (cacheData[key]) {
    return cacheData[key] as T;
  }

  const data = await fetchData();
  cacheData[key] = data;

  return data;
};
