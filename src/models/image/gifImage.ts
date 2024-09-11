import { Result } from '@giphy/js-fetch-api';

export interface GifConvertedData {
  pagination: Pick<Result, 'pagination'>['pagination'];
  gifImages: GifImageModel[];
}

export interface GifImageModel {
  id: string | number;
  title: string;
  imageUrl: string;
}
