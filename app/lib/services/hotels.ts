import ENDPOINTS from '../endpoints';
import { get } from '../request';

async function requestGetHotels(params?: Record<string, any>, headers = {}) {
  const res = await get(ENDPOINTS.HOTELS, {
    headers: {
      ...headers
    },
    params,
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

async function requestSearchHotels(params?: Record<string, any>, headers = {}) {
  const res = await get(ENDPOINTS.HOTELS + '/search', {
    headers: {
      ...headers
    },
    params,
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

async function requestGetHotelDetail(
  id: string,
  headers = {}
): Promise<FetchResult<Hotel>> {
  const res = await get(ENDPOINTS.HOTELS + `/${id}`, {
    headers: {
      ...headers
    },
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

export { requestGetHotels, requestSearchHotels, requestGetHotelDetail };
