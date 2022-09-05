export const getSessionStorageItem = <T>(key: string): T | null => {
  if (sessionStorage.getItem(key) === null) {
    return null;
  }
  return JSON.parse(sessionStorage.getItem(key)!) as T;
};

export const setSessionStorageItem = (key: string, obj: unknown) => {
  sessionStorage.setItem(key, JSON.stringify(obj));
};
