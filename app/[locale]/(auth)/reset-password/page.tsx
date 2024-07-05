import { Metadata } from 'next';
import React, { Suspense } from 'react';
import initTranslations from '@/app/i18n';
import TranslationsProvider from '@/app/components/TranslationsProvider';
import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm';
import { verifyToken } from '@/app/lib/tokens';
import { redirect } from 'next/navigation';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import Link from 'next/link';

type Props = {
  params: {
    locale: string;
  };
  searchParams: {
    token?: string;
  };
};

const i18nNamespaces = ['common'];

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { t } = await initTranslations(locale, i18nNamespaces);

  return {
    title: 'Reset Password'
  };
}

export const dynamic = 'force-dynamic';

export default async function ResetPassword({
  params: { locale },
  searchParams
}: Props) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  const { token } = searchParams;

  if (!token) {
    redirect(LIST_ROUTER.LOGIN);
  }

  const isTokenValid = verifyToken(token, 'reset');

  return (
    <TranslationsProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}
    >
      <div className="grid flex-1 place-items-center p-4 md:p-10">
        <div className="mx-auto w-full max-w-[600px] rounded bg-white p-4 md:max-w-2xl md:p-10 dark:bg-black dark:text-white dark:ring-2 dark:ring-white">
          <h1 className="py-4 text-center text-2xl font-bold md:py-10 md:text-3xl">
            {isTokenValid ? 'Create New Password' : 'The URL is invalid'}
          </h1>

          {isTokenValid ? (
            <Suspense>
              <ResetPasswordForm />
            </Suspense>
          ) : (
            <Link
              className="block rounded bg-blue-700 p-4 py-3 text-center text-lg text-white"
              href={LIST_ROUTER.FORGOT_PASSWORD}
            >
              Try again
            </Link>
          )}
        </div>
      </div>
    </TranslationsProvider>
  );
}
