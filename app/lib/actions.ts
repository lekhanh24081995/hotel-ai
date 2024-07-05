'use server';

import { requestLogout } from './services/auth';
import ENDPOINTS from './endpoints';
import { get, post } from './request';
import { auth, signIn, signOut } from '@/auth';

async function login(payload: any) {
  const res = await post(ENDPOINTS.LOGIN, {
    body: payload,
    cache: 'no-cache'
  });

  return await res.json();
}

async function logout() {
  const session = await auth();
  if (session?.refresh_token) {
    const logoutRes = await requestLogout(
      { refresh_token: session?.refresh_token },
      { Authorization: `Bearer ${session?.access_token}` }
    );
    if (logoutRes.error) {
      throw logoutRes.error;
    }
  }

  const res = await signOut({
    redirect: false
  });
  return res;
}

async function refresh(refresh_token: string) {
  const res = await post(ENDPOINTS.REFRESH_TOKEN, {
    body: { refresh_token },
    cache: 'no-cache'
  });

  return await res.json();
}

async function getUser(params: any, headers = {}) {
  const res = await get(ENDPOINTS.USERS, {
    headers: {
      ...headers
    },
    params,
    cache: 'no-cache'
  });

  if (!res.ok) return new Promise(async (_, rej) => rej(await res.json()));

  return await res.json();
}

export async function socialLogin(type: string) {
  const res: {
    profile: any;
  } = await signIn(type);

  return res;
}

export { login, logout, refresh, getUser };
