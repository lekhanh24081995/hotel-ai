import { Metadata } from 'next';
import initTranslations from '../../i18n';

const i18nNamespaces = ['policy'];

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

async function PrivacyPolicy({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const { t } = await initTranslations(locale, i18nNamespaces);
  return (
    <div className="mx-auto w-4/5 space-y-4">
      <h1 className="mb-5 text-center text-3xl font-bold">{t('title')}</h1>
      <p className="font-semibold">{t('last_updated')}</p>

      {/* Information We Collect Section */}
      <h2 className="font-semibold">{t('information_collect.title')}</h2>
      <ul>
        <li>{t('information_collect.points.0')}</li>
        <li>{t('information_collect.points.1')}</li>
        <li>{t('information_collect.points.2')}</li>
        <li>{t('information_collect.points.3')}</li>
      </ul>

      {/* How We Use Your Information Section */}
      <h2 className="font-semibold">{t('how_we_use.title')}</h2>
      <ul>
        <li>{t('how_we_use.points.0')}</li>
        <li>{t('how_we_use.points.1')}</li>
        <li>{t('how_we_use.points.2')}</li>
        <li>{t('how_we_use.points.3')}</li>
      </ul>

      <h2 className="font-semibold">{t('third_party_services')}</h2>

      <h2 className="font-semibold">{t('security')}</h2>

      <h2 className="font-semibold">{t('changes_to_policy.title')}</h2>
      <p>{t('changes_to_policy.content')}</p>

      <h2 className="font-semibold">{t('contact_us.title')}</h2>
      <ul>
        <li>{t('how_we_use.points.0')}</li>
        <li>{t('how_we_use.points.1')}</li>
      </ul>
    </div>
  );
}

export default PrivacyPolicy;
