const STORAGE_PERIOD_DAY = 1;

const isValidStoragePeriod = (timestamp) => {
  const currentTimeStamp = new Date().getTime();
  const expireTimeStamp = new Date(timestamp).setDate(
    new Date(timestamp).getDate() + STORAGE_PERIOD_DAY,
  );

  if (currentTimeStamp > expireTimeStamp) {
    return false;
  }

  return true;
};

const hasTimeStamp = (obj) => {
  for (let key in obj) {
    if (obj[key] !== null) {
      return true;
    }
  }

  return false;
};

export const getLocalStorage = (key) => {
  const itemObj = JSON.parse(localStorage.getItem(key));

  if (!hasTimeStamp(itemObj)) {
    return [];
  }

  if (!isValidStoragePeriod(itemObj.timestamp)) {
    localStorage.removeItem(key);

    return [];
  }

  return itemObj.item;
};

export const setLocalStorage = (key, data) => {
  const object = { item: data, timestamp: new Date().getTime() };

  localStorage.setItem(key, JSON.stringify(object));
};
