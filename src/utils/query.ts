const cache: Record<string, unknown> = {};

const query = async <T>(key: string, request: () => Promise<T>, staleTime: number): Promise<T> => {
  if (cache[key]) {
    return cache[key] as T;
  }

  const response = await request().then((res) => {
    cache[key] = res;
    setTimeout(() => delete cache[key], staleTime);
    return res;
  });

  return response;
};

export default query;
