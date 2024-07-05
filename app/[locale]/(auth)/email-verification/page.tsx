import EmailVerifyBody from '@/app/components/EmailVerifyBody';
import TranslationsProvider from '@/app/components/TranslationsProvider';
import initTranslations from '@/app/i18n';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

type Props = {
  params: {
    locale: string;
  };
};

const i18nNamespaces = ['email-verify', 'common'];

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { t } = await initTranslations(locale, i18nNamespaces);

  return {
    title: t('document_title')
  };
}

export default async function EmailVerify({ params: { locale } }: Props) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      resources={resources}
      locale={locale}
      namespaces={i18nNamespaces}
    >
      <div className="grid flex-1 place-items-center">
        <Suspense>
          <EmailVerifyBody />
        </Suspense>
      </div>
    </TranslationsProvider>
  );
}
