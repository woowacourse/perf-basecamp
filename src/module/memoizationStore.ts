import { GifImageModel } from '../models/image/gifImage';
const ttl = 120;

const generateMemoStore = function <T>() {
  const memoStore: Record<string, { data: T; time: number }> = {};

  const purgeMemo = (key: string) => {
    const memoTime = Math.floor(Date.now() / 1000) - memoStore[key]?.time;

    if (ttl <= memoTime) {
      delete memoStore[key];
    }
  };

  return {
    getMemoStore(key: string) {
      if (memoStore[key]) {
        purgeMemo(key);
      }

      return {
        memoHit: !!memoStore[key]?.data,
        memoData: memoStore[key]?.data
      };
    },
    setMemoStore(key: string, data: T) {
      memoStore[key] = {
        data,
        time: Math.floor(Date.now() / 1000)
      };
    }
  };
};

export const { getMemoStore: getGifMemoStore, setMemoStore: setGifMemoStore } =
  generateMemoStore<GifImageModel[]>();
