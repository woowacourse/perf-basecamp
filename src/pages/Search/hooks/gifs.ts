import { GifImageModel } from '../../../models/image/gifImage';

class GifStore {
  private gifs: GifImageModel[] = [];

  constructor(gifs: GifImageModel[]) {
    this.gifs = gifs;
  }

  setGifs(gifs: GifImageModel[]) {
    this.gifs.push(...gifs);
  }

  getGifs() {
    return this.gifs;
  }
}

export const gifStore = new GifStore([]);
