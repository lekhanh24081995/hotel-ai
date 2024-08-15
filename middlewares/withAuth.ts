import { NextFetchEvent, NextRequest } from 'next/server';
import { MiddlewareFactory } from './types';
import { auth } from '@/auth';
import {
  APP_API_KEY,
  LIST_ROUTER,
  MIDDLEWARE_CONFIG,
  REQUIRED_API_KEY_ENDPOINTS
} from '@/app/lib/constants/common';
import { headers } from 'next/headers';
import { ApiError, handleError } from '@/app/lib/exceptions';
import { endpointsContainsPath } from '@/app/lib/utils';

export const withAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const authMathcer = new RegExp(MIDDLEWARE_CONFIG.DEFAULT);
    const nextUrl = request.nextUrl;
    const { pathname, search } = nextUrl;

    if (authMathcer.test(pathname)) {
      if (endpointsContainsPath(REQUIRED_API_KEY_ENDPOINTS, pathname)) {
        const apiKey = headers().get('x-api-key');

        if (apiKey !== APP_API_KEY) {
          const error = ApiError.fromUnauthorized();
          return handleError(error, 401);
        }
      }

      const session = await auth();

      const isOnDashboard = pathname.startsWith(LIST_ROUTER.DASHBOARD);
      const isOnLogin = pathname.startsWith(LIST_ROUTER.LOGIN);

      if (isOnDashboard) {
        if (!session) {
          const baseUrl = LIST_ROUTER.LOGIN;
          const url = new URL(baseUrl, nextUrl);
          url.searchParams.set(
            'callbackUrl',
            encodeURI(`${pathname}${search}`)
          );

          return Response.redirect(url);
        }

        if (
          !pathname.startsWith(LIST_ROUTER.CHAT) &&
          !pathname.startsWith(LIST_ROUTER.CHATBOT)
        ) {
          return Response.redirect(new URL(LIST_ROUTER.CHATBOT, nextUrl));
        }
      } else if (session) {
        if (isOnLogin) {
          return Response.redirect(new URL(LIST_ROUTER.DASHBOARD, nextUrl));
        }
      }
      return next(request, _next);
    }
  };
};
