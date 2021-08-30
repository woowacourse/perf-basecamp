import { GiphyFetch } from "@giphy/js-fetch-api";

const TRENDING_GIFS = "TRENDING_GIFS";
const KEYWORD_GIFS = (keyword) => `${keyword.toUpperCase()}_GIFS`;

const local = {
  get: (key) => {
    return JSON.parse(localStorage.getItem(key)) ?? [];
  },

  set: (key, item) => {
    localStorage.setItem(key, JSON.stringify(item));
  },
};

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
      imageUrl: gif.images.original.webp,
    };
  });
};

export const fetchTrendingGifs = async () => {
  const localTrendingGifs = local.get(TRENDING_GIFS);

  if (localTrendingGifs.length) {
    return localTrendingGifs;
  }

  const results = await fetch(TRENDING_GIF_API)
    .then((response) => response.json())
    .then((gifs) => gifs.data)
    .then(formatResponse)
    .catch((e) => {
      return [];
    });

  local.set(TRENDING_GIFS, results);

  return results;
};

export const fetchGifsByKeyword = async (keyword, page = 0) => {
  const localKeywordGifs = local.get(KEYWORD_GIFS(keyword));

  if (localKeywordGifs.length) {
    return localKeywordGifs;
  }

  const offset = page * DEFAULT_FETCH_COUNT;

  const results = await gf
    .search(keyword, { limit: DEFAULT_FETCH_COUNT, lang: "en", offset })
    .then((gifs) => gifs.data)
    .then(formatResponse)
    .catch((e) => {
      return [];
    });

  local.set(KEYWORD_GIFS(keyword), results);

  return results;
};
