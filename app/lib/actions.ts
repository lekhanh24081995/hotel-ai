'use server';

import {
  requestLogin,
  requestLogout,
  requestRefresh,
  requestSocialLogin
} from './services/auth';
import { signIn, signOut } from '@/auth';
import { cookies } from 'next/headers';
import { COOKIE_CONFIG, STORAGE_KEYS } from './constants/common';
import { requestGetMe } from './services/users';

async function login(payload: any) {
  const res: {
    data: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
    error: CustomError;
  } = await requestLogin(payload);
  const data = res.data;
  if (data?.access_token) {
    cookies().set({
      name: STORAGE_KEYS.ACCESS_TOKEN,
      value: data.access_token,
      ...COOKIE_CONFIG
    });
    cookies().set({
      name: STORAGE_KEYS.REFRESH_TOKEN,
      value: data.refresh_token,
      ...COOKIE_CONFIG
    });
  }
  return res;
}

async function logoutAndClearSession() {
  const refresh_token = cookies().get(STORAGE_KEYS.REFRESH_TOKEN)?.value;
  const access_token = cookies().get(STORAGE_KEYS.ACCESS_TOKEN)?.value;

  try {
    const res = await requestLogout(
      { refresh_token },
      {
        Authorization: 'Bearer ' + access_token
      }
    );
    if (!res.error) {
      [STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.REFRESH_TOKEN].forEach((key) => {
        cookies().set(key, '', {
          ...COOKIE_CONFIG,
          maxAge: 0
        });
      });
    }
  } catch (error) {
    console.log('clear token error: ', error);
  }

  const clearRes = await signOut({ redirect: false });
  return clearRes;
}

async function refresh() {
  try {
    const refresh_token = cookies().get(STORAGE_KEYS.REFRESH_TOKEN)?.value;
    const res = await requestRefresh(
      { refresh_token },
      {
        cache: 'no-cache'
      }
    );

    if (res.error) {
      cookies().set(STORAGE_KEYS.ACCESS_TOKEN, '', {
        ...COOKIE_CONFIG,
        maxAge: 0
      });
      cookies().set(STORAGE_KEYS.REFRESH_TOKEN, '', {
        ...COOKIE_CONFIG,
        maxAge: 0
      });
    }

    const data = res.data;

    if (data?.access_token) {
      cookies().set({
        name: STORAGE_KEYS.ACCESS_TOKEN,
        value: data.access_token,
        ...COOKIE_CONFIG
      });
      cookies().set({
        name: STORAGE_KEYS.REFRESH_TOKEN,
        value: data.refresh_token,
        ...COOKIE_CONFIG
      });
    }

    return res;
  } catch (error) {
    throw error;
  }
}

async function getProfile() {
  try {
    const access_token = cookies().get(STORAGE_KEYS.ACCESS_TOKEN)?.value;

    const res = await requestGetMe({
      Authorization: 'Bearer ' + access_token
    });

    return res;
  } catch (error) {
    throw error;
  }
}

async function authSocialLogin(type: string) {
  const res: {
    profile: any;
  } = await signIn(type);

  return res;
}

async function socialLogin(payload: any) {
  const res: {
    data: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
    error: CustomError;
  } = await requestSocialLogin(payload);
  const data = res.data;
  if (data?.access_token) {
    cookies().set({
      name: STORAGE_KEYS.ACCESS_TOKEN,
      value: data.access_token,
      ...COOKIE_CONFIG
    });
    cookies().set({
      name: STORAGE_KEYS.REFRESH_TOKEN,
      value: data.refresh_token,
      ...COOKIE_CONFIG
    });
  }
  return res;
}

export {
  login,
  logoutAndClearSession,
  refresh,
  getProfile,
  authSocialLogin,
  socialLogin
};
