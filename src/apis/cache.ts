export const cache = () => {
  const cache = new Map<string, any>();

  return {
    set: (key: string, value: any) => {
      cache.set(key, value);
    },

    get: (key: string) => {
      return cache.get(key);
    },

    delete: (key: string) => {
      cache.delete(key);
    },

    clear: () => {
      cache.clear();
    }
  };
};
