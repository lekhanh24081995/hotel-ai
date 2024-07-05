import { NextFetchEvent, NextRequest } from 'next/server';

import { MiddlewareFactory } from './types';
import { i18nRouter } from 'next-i18n-router';
import { i18nConfig } from '@/i18nConfig';
import { MIDDLEWARE_CONFIG } from '@/app/lib/constants/common';

export const withI18n: MiddlewareFactory = () => {
  const i18nMatcher = new RegExp(MIDDLEWARE_CONFIG.I18N);

  return async (request: NextRequest, _next: NextFetchEvent) => {
    const { pathname } = request.nextUrl;
    if (i18nMatcher.test(pathname)) {
      return i18nRouter(request, i18nConfig);
    }
  };
};
