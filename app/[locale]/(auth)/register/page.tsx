import RegisterForm from '@/app/components/auth/RegisterForm';
import TranslationsProvider from '@/app/components/TranslationsProvider';
import initTranslations from '@/app/i18n';
import { Metadata } from 'next';

type Props = {
  params: {
    locale: string;
  };
};

const i18nNamespaces = ['common', 'register'];

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { t } = await initTranslations(locale, i18nNamespaces);

  return {
    title: t('register:document_title')
  };
}

export default async function Register({ params: { locale } }: Props) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <TranslationsProvider
      locale={locale}
      namespaces={i18nNamespaces}
      resources={resources}
    >
      <div className="grid flex-1 place-items-center p-4 md:p-10">
        <div className="mx-auto w-full max-w-lg rounded bg-white p-4 md:max-w-2xl md:p-10">
          <h1 className="py-4 text-center text-2xl font-bold md:py-6 md:text-3xl">
            {t('register:title')}
          </h1>

          <RegisterForm />
        </div>
      </div>
    </TranslationsProvider>
  );
}
