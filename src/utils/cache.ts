const cachedResponse: Record<string, { date: Date; response: unknown }> = {};

const TTL = 7 * 24 * 60 * 60 * 1000;

export const cacheResponse = async <Response>(
  key: string,
  getApiResponse: () => Promise<Response>
) => {
  const currentDate = new Date();

  if (cachedResponse[key]) {
    if (currentDate.getTime() - cachedResponse[key].date.getTime() < TTL) {
      return cachedResponse[key].response as Response;
    }
  }

  const data = await getApiResponse();
  cachedResponse[key] = { date: currentDate, response: data };

  return data as Response;
};
