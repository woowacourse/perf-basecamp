interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expirationTime: number;
}

interface ApiCacheConfig {
  defaultTTL: number;
  maxSize: number;
  useSessionStorage: boolean;
  sessionStoragePrefix: string;
}

class ApiCache {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private config: ApiCacheConfig;

  constructor(config: Partial<ApiCacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5분
      maxSize: 100,
      useSessionStorage: true,
      sessionStoragePrefix: 'api-cache-',
      ...config
    };
  }

  /**
   * 캐시에서 데이터 조회
   */
  get<T>(key: string): T | null {
    // 1. 메모리 캐시에서 먼저 확인
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && Date.now() <= memoryEntry.expirationTime) {
      return memoryEntry.data;
    }

    // 2. SessionStorage에서 확인 (설정된 경우)
    if (this.config.useSessionStorage) {
      try {
        const sessionData = sessionStorage.getItem(this.config.sessionStoragePrefix + key);
        if (sessionData) {
          const entry: CacheEntry<T> = JSON.parse(sessionData);

          if (Date.now() <= entry.expirationTime) {
            // 메모리 캐시에 다시 저장 (다음 접근을 위해)
            this.setMemoryCache(key, entry.data, entry.expirationTime - Date.now());
            return entry.data;
          } else {
            // 만료된 캐시 삭제
            sessionStorage.removeItem(this.config.sessionStoragePrefix + key);
          }
        }
      } catch (error) {
        console.warn('Failed to read from sessionStorage:', error);
      }
    }

    return null;
  }

  /**
   * 캐시에 데이터 저장
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const timestamp = Date.now();
    const expirationTime = timestamp + (ttl || this.config.defaultTTL);

    // 메모리 캐시에 저장
    this.setMemoryCache(key, data, ttl || this.config.defaultTTL);

    // SessionStorage에 저장 (설정된 경우)
    if (this.config.useSessionStorage) {
      try {
        const entry: CacheEntry<T> = {
          data,
          timestamp,
          expirationTime
        };

        sessionStorage.setItem(this.config.sessionStoragePrefix + key, JSON.stringify(entry));
      } catch (error) {
        console.warn('Failed to save to sessionStorage:', error);
      }
    }
  }

  /**
   * 메모리 캐시에 데이터 저장
   */
  private setMemoryCache<T>(key: string, data: T, ttl: number): void {
    const timestamp = Date.now();
    const expirationTime = timestamp + ttl;

    // 캐시 크기 제한 확인
    if (this.memoryCache.size >= this.config.maxSize && !this.memoryCache.has(key)) {
      // LRU 방식으로 가장 오래된 항목 삭제
      const oldestKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(oldestKey || '');
    }

    this.memoryCache.set(key, {
      data,
      timestamp,
      expirationTime
    });
  }

  /**
   * 특정 키의 캐시 삭제
   */
  delete(key: string): boolean {
    const memoryDeleted = this.memoryCache.delete(key);

    if (this.config.useSessionStorage) {
      try {
        sessionStorage.removeItem(this.config.sessionStoragePrefix + key);
      } catch (error) {
        console.warn('Failed to delete from sessionStorage:', error);
      }
    }

    return memoryDeleted;
  }

  /**
   * 모든 캐시 삭제
   */
  clear(): void {
    this.memoryCache.clear();

    if (this.config.useSessionStorage) {
      try {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
          if (key.startsWith(this.config.sessionStoragePrefix)) {
            sessionStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Failed to clear sessionStorage cache:', error);
      }
    }
  }

  /**
   * 만료된 캐시들 정리
   */
  cleanup(): void {
    const now = Date.now();

    // 메모리 캐시 정리
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now > entry.expirationTime) {
        this.memoryCache.delete(key);
      }
    }

    // SessionStorage 정리
    if (this.config.useSessionStorage) {
      try {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
          if (key.startsWith(this.config.sessionStoragePrefix)) {
            try {
              const entryStr = sessionStorage.getItem(key);
              if (entryStr) {
                const entry: CacheEntry<any> = JSON.parse(entryStr);
                if (now > entry.expirationTime) {
                  sessionStorage.removeItem(key);
                }
              }
            } catch (error) {
              // 파싱 에러 시 삭제
              sessionStorage.removeItem(key);
            }
          }
        });
      } catch (error) {
        console.warn('Failed to cleanup sessionStorage:', error);
      }
    }
  }

  /**
   * 캐시 크기 반환
   */
  size(): number {
    return this.memoryCache.size;
  }

  /**
   * 캐시된 키 목록 반환
   */
  keys(): string[] {
    return Array.from(this.memoryCache.keys());
  }

  /**
   * 비동기 함수에 캐싱 적용
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
      throw error;
    }
  }
}

// 기본 설정으로 싱글톤 인스턴스 생성
export const apiCache = new ApiCache();

// 커스텀 설정으로 캐시 인스턴스 생성하는 팩토리 함수
export const createApiCache = (config: Partial<ApiCacheConfig>) => {
  return new ApiCache(config);
};

export default ApiCache;
