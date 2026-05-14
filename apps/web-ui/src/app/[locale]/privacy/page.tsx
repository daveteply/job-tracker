import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BackButton } from '@job-tracker/ui-components';

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('PrivacyPage');

  return (
    <div className="bg-base-100 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <BackButton />
          <h1 className="text-base-content mb-2 text-4xl font-extrabold">{t('title')}</h1>
          <p className="text-base-content/60 text-sm">{t('lastUpdated')}</p>
        </div>

        <div className="text-base-content/80 max-w-none space-y-12">
          <section>
            <p className="text-lg leading-relaxed">{t('introduction')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('dataCollection')}
            </h2>
            <p className="leading-relaxed">{t('dataCollectionContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('usageAnalytics')}
            </h2>
            <p className="leading-relaxed">{t('usageAnalyticsContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('dataStorage')}
            </h2>
            <p className="leading-relaxed">{t('dataStorageContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('yourRights')}
            </h2>
            <p className="leading-relaxed">{t('yourRightsContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('contactUs')}
            </h2>
            <p className="leading-relaxed">{t('contactUsContent')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
