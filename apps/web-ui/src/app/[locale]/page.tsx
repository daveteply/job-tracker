import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '../../i18n/routing';

export default async function IndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('IndexPage');

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{t('title')}</h1>
          <p className="py-6">{t('description')}</p>
          <Link className="btn btn-primary" href="/home">
            {t('dashboardButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}
