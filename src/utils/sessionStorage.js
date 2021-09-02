export const getValueFromSessionStorage = (key) => {
  try {
    const storedValue = sessionStorage.getItem(key);

    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error(error);
  }
};

export const setValueToSessionStorage = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};
