import { gifAPIService } from '../../apis/gifAPIService';
import { GifImageModel } from '../../models/image/gifImage';

const MAX_AGE_MS = 10 * 60 * 1000;

let entry: { promise: Promise<GifImageModel[]>; createdAt: number } | null = null;

const isFresh = (createdAt: number): boolean => Date.now() - createdAt < MAX_AGE_MS;

// 같은 Promise 객체를 돌려주므로 로딩 중에 다시 마운트돼도 요청이 겹치지 않고, use()가 렌더마다 같은 값을 읽는다.
// async로 감싸면 호출마다 새 Promise가 되어 use()가 끝없이 suspend한다
export const trendingCache = {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  load: (): Promise<GifImageModel[]> => {
    if (entry !== null && isFresh(entry.createdAt)) return entry.promise;

    const promise = gifAPIService.getTrending();
    entry = { promise, createdAt: Date.now() };
    // 실패한 Promise도 그대로 둔다. 실패 직후 비우면 React가 재렌더하며 새 요청을 만들어 장애 중엔 끝없이 다시 요청한다.
    // use()가 거부를 에러 경계로 던지고, 재시도는 reload나 만료 뒤에 일어난다
    promise.catch(() => {});

    return promise;
  }
};
