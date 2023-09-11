type Data = any;

interface Storage {
  [key: string]: Data;
}

const storage: Storage = {};

export const cachedGetData = async (key: string, fetcher: () => Promise<Data>) => {
  if (storage[key]) {
    return storage[key];
  }

  const data = await fetcher();
  storage[key] = data;

  return data;
};
