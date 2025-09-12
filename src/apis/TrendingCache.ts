import { GifImageModel } from '../models/image/gifImage';

interface Cache {
  data: GifImageModel[];
  timestamp: number;
  expiresAt: number;
}

class TrendingCache {
  private cache: Cache | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5분

  set(data: GifImageModel[]): void {
    const now = Date.now();
    this.cache = {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION
    };
  }

  get(): GifImageModel[] | null {
    if (!this.cache) return null;

    if (!this.isValid()) {
      this.clear();
      return null;
    }

    return this.cache.data;
  }

  isValid(): boolean {
    if (!this.cache) return false;
    return Date.now() <= this.cache.expiresAt;
  }

  clear(): void {
    this.cache = null;
  }

  getAge(): number {
    if (!this.cache) return 0;
    return Date.now() - this.cache.timestamp;
  }
}

export const trendingCache = new TrendingCache();
