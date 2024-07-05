import ENDPOINTS from '../endpoints';
import { get, post, put } from '../request';

async function requestGetMe(headers = {}) {
  const res = await get(ENDPOINTS.PROFILE, {
    headers: {
      ...headers
    },
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestResetPassword(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.RESET_PASSWORD, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}
async function requestUpdate(id: string, payload: any, headers = {}) {
  const res = await put(ENDPOINTS.USERS, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache',
    params: { _id: id }
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

export { requestGetMe, requestResetPassword, requestUpdate };
