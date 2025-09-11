interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expirationTime: number;
}

interface ApiCacheConfig {
  defaultTTL: number; // milliseconds
  maxSize: number;
}

class ApiCache {
  private cache = new Map<string, CacheEntry<any>>();
  private config: ApiCacheConfig;

  constructor(config: Partial<ApiCacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5분
      maxSize: 100,
      ...config
    };
  }

  /**
   * 캐시에서 데이터를 조회합니다.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // 만료된 캐시는 삭제하고 null 반환
    if (Date.now() > entry.expirationTime) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * 캐시에 데이터를 저장합니다.
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const timestamp = Date.now();
    const expirationTime = timestamp + (ttl || this.config.defaultTTL);

    // 캐시 크기 제한 확인
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      // LRU 방식으로 가장 오래된 항목 삭제
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey || '');
    }

    this.cache.set(key, {
      data,
      timestamp,
      expirationTime
    });
  }

  /**
   * 특정 키의 캐시를 삭제합니다.
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 모든 캐시를 삭제합니다.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 만료된 캐시들을 정리합니다.
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expirationTime) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 캐시 크기를 반환합니다.
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 캐시된 키 목록을 반환합니다.
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * 비동기 함수에 캐싱을 적용합니다.
   */
  async wrap<T>(key: string, asyncFn: () => Promise<T>, ttl?: number): Promise<T> {
    // 캐시된 데이터가 있으면 반환
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // 캐시된 데이터가 없으면 함수 실행 후 캐시에 저장
    try {
      const result = await asyncFn();
      this.set(key, result, ttl);
      return result;
    } catch (error) {
      // 에러가 발생한 경우 캐시하지 않고 에러를 다시 던짐
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
export const apiCache = new ApiCache({
  defaultTTL: 5 * 60 * 1000, // 5분
  maxSize: 50
});

export default ApiCache;
