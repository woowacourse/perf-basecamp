export interface CachePolicy {
  key: string; // localStorage에 저장될 키
  version: string; // 캐시 무효화를 하기 위해선 해당 값을 올려야 함
  ttl: number; // 만료까지의 시간(ms)
}

interface CacheEntry<T> {
  version: string;
  expiresAt: number;
  value: T;
}

// 스키마 변경, 만료 검증하기 위한 목적의 가드 유틸
const isCacheEntry = (parsed: unknown): parsed is CacheEntry<unknown> => {
  if (typeof parsed !== 'object' || parsed === null) return false;

  const entry = parsed as Partial<CacheEntry<unknown>>;

  return typeof entry.version === 'string' && typeof entry.expiresAt === 'number';
};

export const localCache = {
  get: <T>({ key, version }: CachePolicy): T | null => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;

      const parsed: unknown = JSON.parse(raw);

      // 스키마가 바뀌었거나, 버전이 올라갔거나, 만료된 캐시는 즉시 버림
      if (!isCacheEntry(parsed) || parsed.version !== version || Date.now() > parsed.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value as T;
    } catch {
      return null;
    }
  },

  set: <T>({ key, version, ttl }: CachePolicy, value: T): void => {
    try {
      const entry: CacheEntry<T> = {
        version,
        expiresAt: Date.now() + ttl,
        value
      };

      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // 저장에 실패 시 조회는 캐시 미스
    }
  },

  remove: ({ key }: CachePolicy): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // 저장에 실패 시 조회는 캐시 미스
    }
  }
};
