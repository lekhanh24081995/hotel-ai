'use server';

import { requestLogin, requestLogout, requestRefresh } from './services/auth';
import { signIn, signOut } from '@/auth';
import { cookies } from 'next/headers';
import { COOKIE_CONFIG, STORAGE_KEYS } from './constants/common';

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

async function logout() {
  const refresh_token = cookies().get(STORAGE_KEYS.REFRESH_TOKEN)?.value;
  const access_token = cookies().get(STORAGE_KEYS.ACCESS_TOKEN)?.value;

  const res: {
    error: CustomError;
  } = await requestLogout(
    { refresh_token },
    {
      Authorization: 'Bearer ' + access_token
    }
  );
  if (!res.error) {
    cookies().set(STORAGE_KEYS.ACCESS_TOKEN, '', {
      ...COOKIE_CONFIG,
      maxAge: 0
    });
    cookies().set(STORAGE_KEYS.REFRESH_TOKEN, '', {
      ...COOKIE_CONFIG,
      maxAge: 0
    });
  }
  return res;
}

async function clearSession() {
  const res = await signOut({
    redirect: false
  });
  return res;
}

async function refresh() {
  const refresh_token = cookies().get(STORAGE_KEYS.REFRESH_TOKEN)?.value;
  const res = await requestRefresh(
    { refresh_token },
    {
      cache: 'no-cache'
    }
  );
  console.log('actions.ts: ', { refresh_token, res });

  if (res.error) {
    console.log('delete old coolies');
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
    console.log('Set new cookies');
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

export async function socialLogin(type: string) {
  const res: {
    profile: any;
  } = await signIn(type);

  return res;
}

export { login, logout, refresh, clearSession };
