import { Metadata } from 'next';
import React, { Suspense } from 'react';
import initTranslations from '@/app/i18n';
import TranslationsProvider from '@/app/components/TranslationsProvider';
import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm';

type Props = {
  params: {
    locale: string;
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
    title: 'Forgot Password'
  };
}

export default async function ForgotPassword({ params: { locale } }: Props) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}
    >
      <div className="grid flex-1 place-items-center p-4 md:p-10">
        <div className="mx-auto w-full max-w-[600px] rounded bg-white p-4 md:max-w-2xl md:p-10 dark:bg-black dark:text-white dark:ring-2 dark:ring-white">
          <h1 className="py-4 text-center text-2xl font-bold md:py-10 md:text-3xl">
            Reset Password
          </h1>

          <Suspense>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </div>
    </TranslationsProvider>
  );
}
