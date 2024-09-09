import { GifImageModel } from '../models/image/gifImage';

export type Query<T> = {
  requestTime: number;
  data: T;
  staleTime: number;
};

interface QueryKey<T> {
  [key: string]: Query<T>;
}

export const QUERY_KEYS = {
  getTrending: 'getTrending'
};

const QUERY_DATA: QueryKey<GifImageModel[]> = {};

export const isQueryKeyValid = (queryKey: string) => {
  if (!QUERY_DATA[queryKey]) return false;

  const now = Date.now();
  const endTime = QUERY_DATA[queryKey].requestTime + QUERY_DATA[queryKey].staleTime;

  if (now > endTime) return false;

  return true;
};

export const setQuery = (queryKey: string, query: Query<GifImageModel[]>) => {
  QUERY_DATA[queryKey] = query;
};

export const getQueryData = (queryKey: string) => {
  return QUERY_DATA[queryKey].data;
};
