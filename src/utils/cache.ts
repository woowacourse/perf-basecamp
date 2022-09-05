const cachedStorage: Record<string, unknown> = {};

export const caching = <T>(key: string, fetcher: () => T): T => {
  if (cachedStorage[key]) {
    return cachedStorage[key] as T;
  }

  const response = fetcher();
  cachedStorage[key] = response;

  return response;
};
