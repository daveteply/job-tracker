import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

import { BRANDING } from '@job-tracker/domain';

import { Link } from '../../i18n/routing';

export default async function IndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('IndexPage');

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="flex w-full max-w-md flex-col items-center px-4">
          <div className="relative aspect-square w-full">
            <Image
              src="/vireo-logo-1t.png"
              alt={`${BRANDING.name} Logo`}
              fill
              className="object-contain blur-[0.2px] drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              priority
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
          <p className="py-6">{t('description')}</p>
          <Link className="btn btn-primary" href="/home">
            {t('dashboardButton')}
          </Link>
        </div>
      </div>
    </div>
  );
}
