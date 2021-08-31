export const setSessionStorage = (key, value) => {
  const stringified = JSON.stringify(value) ?? "";

  sessionStorage.setItem(key, stringified);
};

export const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key);

  if (!item) return null;

  return JSON.parse(item);
};
