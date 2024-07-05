import { Metadata } from 'next';
import initTranslations from '../../i18n';

const i18nNamespaces = ['terms'];

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

async function TermsOfService({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, i18nNamespaces);
  return (
    <div className="mx-auto w-4/5 space-y-4">
      <h1 className="mb-5 text-center text-3xl font-bold">{t('title')}</h1>
      <p className="font-semibold">{t('last_updated')}</p>

      <div>
        <h3 className="font-semibold">{t('sections.introduction.title')}</h3>
        <p>{t('sections.introduction.content')}</p>
      </div>
      <div>
        <h3 className="font-semibold">{t('sections.usage.title')}</h3>
        <p>{t('sections.usage.content')}</p>
      </div>
      <div>
        <h3 className="font-semibold">{t('sections.termination.title')}</h3>
        <p>{t('sections.termination.content')}</p>
      </div>
    </div>
  );
}

export default TermsOfService;
