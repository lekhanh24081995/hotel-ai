import querystring from 'query-string';
import fetchInterceptor from './fetchInterceptor';
import {
  checkUserTokenUnauthorized,
  createRefreshUserToken
} from './createRefreshUserToken';

export enum BodyType {
  Json,
  Urlencoded
}

interface IRequestOptions {
  bodyType?: BodyType;
  body?: any;
  headers?: HeadersInit;
  params?: Record<string, any>;
  cache?: RequestCache;
}

const request = fetchInterceptor({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'en'
  },
  interceptors: {
    response: async (res, req, fetch) => {
      if (checkUserTokenUnauthorized(res)) {
        return createRefreshUserToken(req, res, fetch);
      }
      return res;
    }
  }
});

const processBodyType = (
  body: Record<string, any>,
  bodyType: BodyType.Json | BodyType.Urlencoded
) => {
  let headers: HeadersInit = {};
  let bodyToSend: string | FormData = '';

  if (bodyType === BodyType.Json) {
    headers = {
      'Content`-Type': 'application/json'
    };
    bodyToSend = body ? JSON.stringify(body) : '';
  } else if (bodyType === BodyType.Urlencoded) {
    headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    bodyToSend = body ? new URLSearchParams(body).toString() : '';
  }

  return { headers, bodyToSend };
};

const appendParamsToUrl = (url: string, params?: Record<string, any>) => {
  if (!params || !Object.keys(params).length) return url;
  return `${url}?${querystring.stringify(params)}`;
};

const get = (
  url: string,
  options?: {
    headers?: HeadersInit;
    params?: Record<string, any>;
    cache?: RequestCache;
  }
) => {
  const urlParams = appendParamsToUrl(url, options?.params);
  return request(urlParams, {
    headers: {
      ...(options?.headers || {})
    },
    ...options
  });
};

const post = (url: string, options: IRequestOptions) => {
  const urlParams = appendParamsToUrl(url, options?.params);
  const { headers, bodyToSend } = processBodyType(
    options.body,
    options?.bodyType || BodyType.Json
  );
  return request(urlParams, {
    method: 'POST',
    headers: {
      ...headers,
      ...(options?.headers || {})
    },
    body: bodyToSend,
    cache: options?.cache || 'no-store'
  });
};

const put = (url: string, options: IRequestOptions) => {
  const urlParams = appendParamsToUrl(url, options?.params);
  const { headers, bodyToSend } = processBodyType(
    options.body,
    options?.bodyType || BodyType.Json
  );

  return request(urlParams, {
    method: 'PUT',
    headers: {
      ...headers,
      ...(options?.headers || {})
    },
    body: bodyToSend
  });
};

export { get, post, put };
