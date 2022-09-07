import { GifImageModel } from '../models/image/gifImage';
const ttl = 60;

// const generateMemoStoreWithSetTimeout = function <T>() {
//   const memoStore: Record<string, { data: T; timeout: NodeJS.Timeout }> = {};

//   // setTimeout으로 브라우저의 자료구조를 이용하는 코드보다 훨씬 나은 것 같다!!
//   const purgeMemo = (key: string) => {
//     delete memoStore[key];
//   };

//   return {
//     getMemoStore(key: string) {
//       return {
//         memoHit: !!memoStore[key]?.data,
//         memoData: memoStore[key]?.data
//       };
//     },
//     setMemoStore(key: string, data: T) {
//       if (memoStore[key]) {
//         clearTimeout(memoStore[key].timeout);
//       }

//       memoStore[key] = {
//         data,
//         timeout: setTimeout(() => {
//           purgeMemo(key);
//         }, ttl * 1000)
//       };
//     }
//   };
// };

// setTimeout으로 브라우저의 자료구조를 이용하는 코드보다 훨씬 나은 것 같다!!
// 이유 1. 디바운스 코드 작성(여러번 set되는 경우 마지막 purgeMemo만 수행되어야함)
// 이유 2. 아래 방식의 관점과 달리 추가 작업이 트리거(taskqueue 자료구조에 셋팅, 이벤트 루프가 동작하여 콜 스택에 자료구조에 있는 작업을 스케줄링 해주는 작업이 트리거된다)

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
