import { Config } from 'next-i18n-router/dist/types';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

export const i18nConfig: Config = {
  locales: ['en'],
  defaultLocale: 'en',
  basePath: basePath
};
