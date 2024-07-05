import { refresh } from '../actions';
import { REQUIRED_TOKEN_ENDPOINTS } from '../constants/common';
import { FetchArgs, FetchInterceptor } from './fetchInterceptor';

const cache: {
  isRefreshing: boolean;
  skipInstances: (() => void)[];
} = {
  isRefreshing: false,
  skipInstances: []
};

function onTokenRefreshed() {
  cache.isRefreshing = false;
  cache.skipInstances.forEach((cb) => cb());
  cache.skipInstances = [];
}

export async function createRefreshUserToken(
  req: FetchArgs,
  res: Response,
  fetch: ReturnType<FetchInterceptor>
): Promise<Response> {
  if (!cache.isRefreshing) {
    cache.isRefreshing = true;
    try {
      const refreshRes = await refresh('');
      if (refreshRes.error) {
        onTokenRefreshed();
        return fetch(...req);
      }

      return res;
    } catch (e) {
      return res;
    }
  } else {
    const retryOriginalRequest: Promise<Response> = new Promise((resolve) => {
      cache.skipInstances.push(() => resolve(fetch(...req)));
    });

    return retryOriginalRequest;
  }
}

export const checkUserTokenUnauthorized = (res: Response) => {
  const url = res.url;
  return (
    res.status === 401 &&
    REQUIRED_TOKEN_ENDPOINTS.some((endpoint: string) => url.includes(endpoint))
  );
};
