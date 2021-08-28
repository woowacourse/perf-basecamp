import { GiphyFetch } from "@giphy/js-fetch-api";
import { getFromLocalStorage, setToLocalStorage } from "../utils/localStorage";

/**
 * 응답 예제는 아래 링크에서 참고
 * https://developers.giphy.com/explorer/#explorer
 */
const gf = new GiphyFetch(process.env.GIPHY_API_KEY);
const DEFAULT_FETCH_COUNT = 16;
const TRENDING_GIF_API = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}&limit=${DEFAULT_FETCH_COUNT}&rating=g`;

const formatResponse = (gifList) => {
  return gifList.map((gif) => {
    return {
      id: gif.id,
      title: gif.title,
      imageUrl: gif.images.original.url,
    };
  });
};

export const fetchTrendingGifs = async () => {
  const memoizedGifs = getFromLocalStorage("trending_gifs");
  if (memoizedGifs) {
    return memoizedGifs;
  }

  const trendingGifs = await fetch(TRENDING_GIF_API)
    .then((response) => response.json())
    .then((gifs) => gifs.data)
    .then(formatResponse)
    .catch((e) => {
      return [];
    });

  setToLocalStorage("trending_gifs", trendingGifs, 10);

  return trendingGifs;
};

export const fetchGifsByKeyword = async (keyword, page = 0) => {
  const memoizedGifs = getFromLocalStorage(`keyword_${keyword}_${page}_gifs`);
  if (memoizedGifs) {
    return memoizedGifs;
  }

  const offset = page * DEFAULT_FETCH_COUNT;

  const gifsByKeyword = await gf
    .search(keyword, { limit: DEFAULT_FETCH_COUNT, lang: "en", offset })
    .then((gifs) => gifs.data)
    .then(formatResponse)
    .catch((e) => {
      return [];
    });

  setToLocalStorage(`keyword_${keyword}_${page}_gifs`, gifsByKeyword, 10);

  return gifsByKeyword;
};
