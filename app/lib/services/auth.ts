import ENDPOINTS from '../endpoints';
import { get, post } from '../request';

async function requestLogin(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.LOGIN, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestSocialLogin(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.SOCIAL_LOGIN, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestRegister(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.USERS, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestRefresh(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.REFRESH_TOKEN, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function requestVerifyEmail(token: string, headers = {}) {
  const res = await get(ENDPOINTS.EMAIL_VERIFICATION + `/${token}`, {
    headers: {
      ...headers
    },
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

async function requestLogout(payload: any, headers = {}) {
  const res = await post(ENDPOINTS.LOGOUT, {
    headers: {
      ...headers
    },
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

export {
  requestLogin,
  requestSocialLogin,
  requestRegister,
  requestLogout,
  requestVerifyEmail,
  requestRefresh
};
