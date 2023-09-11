export interface GifImageModel {
  id: string | number;
  title: string;
  imageUrl: string;
}

export const isGifImageModel = (data: any): data is GifImageModel => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'title' in data &&
    'imageUrl' in data &&
    (typeof data.id === 'string' || typeof data.id === 'number') &&
    typeof data.title === 'string' &&
    typeof data.imageUrl === 'string'
  );
};

export const isGifImageModels = (data: any): data is GifImageModel[] => {
  return Array.isArray(data) && data.every((item) => isGifImageModel(item));
};
