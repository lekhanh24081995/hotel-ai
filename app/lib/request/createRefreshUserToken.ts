import { refresh } from '../actions';
import { REQUIRED_TOKEN_ENDPOINTS } from '../constants/common';
import ENDPOINTS from '../endpoints';
import { FetchArgs, FetchInterceptor } from './fetchInterceptor';

const cache: {
  isRefreshing: boolean;
  skipInstances: ((token: string) => void)[];
} = {
  isRefreshing: false,
  skipInstances: []
};

function onTokenRefreshed(token: string) {
  cache.isRefreshing = false;
  cache.skipInstances.forEach((cb) => cb(token));
  cache.skipInstances = [];
}

export async function createRefreshUserToken(
  req: FetchArgs,
  res: Response,
  fetch: ReturnType<FetchInterceptor>
): Promise<Response> {
  const urlPath = req[0];
  const urlPathStr = typeof urlPath === 'string' ? urlPath : urlPath.toString();
  if (!cache.isRefreshing) {
    cache.isRefreshing = true;
    try {
      const refreshRes = await refresh();

      if (refreshRes.error) {
        return res;
      }

      const { access_token, refresh_token } = refreshRes.data;

      if (refreshRes.error) {
        return res;
      }
      onTokenRefreshed(access_token);

      if (urlPathStr.includes(ENDPOINTS.LOGOUT)) {
        return fetch(req[0], {
          ...req[1],
          headers: {
            ...req[1]?.headers,
            Authorization: `Bearer ${access_token}`
          },
          body: JSON.stringify({
            refresh_token: refresh_token
          })
        });
      }

      return fetch(req[0], {
        ...req[1],
        headers: {
          ...req[1]?.headers,
          Authorization: `Bearer ${access_token}`
        }
      });
    } catch (e) {
      return res;
    }
  } else {
    const retryOriginalRequest: Promise<Response> = new Promise((resolve) => {
      cache.skipInstances.push((token: string) =>
        resolve(
          fetch(req[0], {
            ...req[1],
            headers: {
              ...req[1]?.headers,
              Authorization: `Bearer ${token}`
            }
          })
        )
      );
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
