const DEFAULT_TIME_TO_LIVE_SECONDS = 3600;
const MILLISECONDS = 1000;

class CacheStore<T> {
  private store: T[] = [];
  private TTL: number;
  private saveTime: null | Date = null;

  constructor(TTL = DEFAULT_TIME_TO_LIVE_SECONDS) {
    this.TTL = TTL;
  }

  checkEmpty() {
    this.checkDataInitialize();

    return this.store.length === 0;
  }

  load() {
    this.checkDataInitialize();

    return this.store;
  }

  save(newData: T[], updateTime: Date) {
    this.checkDataInitialize();

    this.saveTime = updateTime;
    this.store = this.store.concat(newData);
  }

  private checkDataInitialize() {
    if (!this.checkFresh()) {
      this.store = [];
      return true;
    }

    return false;
  }

  private checkFresh() {
    const currentTime = new Date().getTime();

    return (
      this.saveTime !== null && (currentTime - this.saveTime.getTime()) / MILLISECONDS < this.TTL
    );
  }
}

export default CacheStore;
