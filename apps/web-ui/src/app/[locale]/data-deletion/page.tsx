import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Link } from '../../../i18n/routing';

export default async function DataDeletionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('DataDeletionPage');

  return (
    <div className="bg-base-100 min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/auth/signin"
            className="text-primary mb-4 inline-block text-sm hover:underline"
          >
            &larr; Back to Sign In
          </Link>
          <h1 className="text-base-content mb-2 text-4xl font-extrabold">{t('title')}</h1>
          <p className="text-base-content/60 text-sm">{t('lastUpdated')}</p>
        </div>

        <div className="text-base-content/80 max-w-none space-y-12">
          <section>
            <p className="text-lg leading-relaxed">{t('introduction')}</p>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('howToDelete')}
            </h2>
            <div className="space-y-4">
              <p className="leading-relaxed">{t('howToDeleteContent')}</p>
              <ul className="list-inside list-disc space-y-2 pl-4">
                <li>{t('stepEmail')}</li>
                <li>{t('stepSubject')}</li>
                <li>{t('stepDetails')}</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-base-content border-base-300 mb-4 border-b pb-2 text-2xl font-bold">
              {t('processTime')}
            </h2>
            <p className="leading-relaxed">{t('processTimeContent')}</p>
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
