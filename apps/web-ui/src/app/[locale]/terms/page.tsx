import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BackButton } from '@job-tracker/ui-components';

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('TermsPage');

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
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('acceptance')}
            </h2>
            <p className="leading-relaxed">{t('acceptanceContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('description')}
            </h2>
            <p className="leading-relaxed">{t('descriptionContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('userConduct')}
            </h2>
            <p className="leading-relaxed">{t('userConductContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('limitationOfLiability')}
            </h2>
            <p className="leading-relaxed">{t('limitationOfLiabilityContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('governingLaw')}
            </h2>
            <p className="leading-relaxed">{t('governingLawContent')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('changesToTerms')}
            </h2>
            <p className="leading-relaxed">{t('changesToTermsContent')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
