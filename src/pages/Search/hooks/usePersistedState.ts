import { useEffect, useState } from 'react';

type StorageEngine = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const usePersistedState = <T>(
  key: string,
  defaultValue: T,
  storage: StorageEngine = localStorage
): [T, React.Dispatch<T>] => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = storage.getItem(key);
    if (storedValue === null) return defaultValue;

    return JSON.parse(storedValue);
  });

  useEffect(() => {
    storage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
};

export default usePersistedState;
