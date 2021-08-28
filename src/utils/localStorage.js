const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const getFromLocalStorage = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));

    const now = new Date();
    if (new Date(data.expiryDate) < now) {
      removeLocalStorage(key);

      return undefined;
    }

    return data.value;
  } catch (error) {
    return undefined;
  }
};

export const setToLocalStorage = (
  key,
  value,
  expiryMinutes = 60 * 24 * 365
) => {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + expiryMinutes);

  const decycled = JSON.stringify(
    { value, expiryDate: expiryDate.toJSON() },
    getCircularReplacer()
  );

  if (decycled) {
    localStorage.setItem(key, decycled);
  } else {
    console.error("JSON stringify error.");
  }
};

export const removeLocalStorage = (key) => {
  return localStorage.removeItem(key);
};
