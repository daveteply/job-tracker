import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

import { BRANDING } from '@job-tracker/domain';

import { Link } from '../../i18n/routing';

import { PwaInstallButton } from './pwa-install-button';
import { ScrollToTopButton } from './scroll-to-top-button';

export default async function IndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('IndexPage');

  const featureKeys = [
    { key: 'localFirst', icon: '/mascot/local-first-a.webp' },
    { key: 'offlineReady', icon: '/mascot/offline-ready-pwa-a.webp' },
    { key: 'cloudSync', icon: '/mascot/cloud-sync-a.webp' },
    { key: 'reminders', icon: '/mascot/smart-reminders-a.webp' },
    { key: 'crossPlatform', icon: '/mascot/cross-platform-a.webp' },
  ] as const;

  return (
    <div className="bg-base-100 flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="hero bg-base-200 min-h-[70vh]">
        <div className="hero-content text-center">
          <div className="flex w-full max-w-2xl flex-col items-center px-4">
            <div className="relative aspect-square w-48 transition-transform duration-700 hover:scale-110 md:w-64">
              <Image
                src="/vireo-logo-1t.png"
                alt={`${BRANDING.name} Logo`}
                fill
                className="object-contain blur-[0.1px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
                priority
                sizes="(max-width: 768px) 192px, 256px"
              />
            </div>
            <h1 className="mt-8 text-4xl font-bold md:text-5xl">{t('description')}</h1>
            <p className="py-6 text-xl opacity-90">{t('subtext')}</p>
            <Link
              className="btn btn-primary btn-lg px-8 shadow-lg transition-all hover:scale-105"
              href="/home"
            >
              {t('dashboardButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-wrap justify-center gap-12">
          {featureKeys.map(({ key, icon }) => (
            <div
              key={key}
              className="card bg-base-200 border-base-300 group hover:border-primary/30 w-full max-w-sm overflow-hidden border shadow-xl transition-all duration-300 md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.7rem)]"
            >
              <figure className="bg-base-300/30 relative h-48 px-6 pt-6">
                <Image
                  src={icon}
                  alt={t(`features.${key}.title`)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-primary group-hover:text-primary-focus transition-colors">
                  {t(`features.${key}.title`)}
                </h2>
                <p className="text-base-content/80">{t(`features.${key}.description`)}</p>
                {key === 'offlineReady' && (
                  <div className="card-actions mt-4 justify-end">
                    <a
                      href="#pwa-install"
                      className="btn btn-link btn-xs text-primary p-0 font-semibold no-underline hover:underline"
                    >
                      {t('features.offlineReady.learnMore')} →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Beta Program Section */}
      <section className="bg-primary text-primary-content relative overflow-hidden px-4 py-24">
        {/* Subtle decorative elements */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-black/10 blur-2xl"></div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">{t('beta.title')}</h2>
          <p className="mb-12 text-xl opacity-95 md:text-2xl">{t('beta.description')}</p>
          <Link
            className="btn btn-secondary btn-lg px-12 shadow-xl transition-transform hover:scale-105"
            href="/beta"
          >
            {t('beta.button')}
          </Link>
        </div>
      </section>

      {/* PWA Install Section */}
      <section id="pwa-install" className="bg-base-200 scroll-mt-20 px-4 py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-16 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <div className="bg-primary/10 text-primary mb-6 inline-block rounded-full px-4 py-1 text-sm font-bold">
              Modern App Experience
            </div>
            <h2 className="mb-8 text-3xl font-bold md:text-4xl">{t('pwa.title')}</h2>
            <p className="text-base-content/90 mb-4 text-lg">{t('pwa.description')}</p>
            <p className="mb-10 text-sm italic opacity-70">{t('pwa.subtext')}</p>
            <PwaInstallButton />
          </div>
          <div className="flex flex-1 justify-center">
            <div className="group relative">
              <div className="bg-primary/5 absolute inset-0 scale-105 -rotate-3 rounded-[3rem] transition-transform duration-500 group-hover:rotate-0"></div>
              <div className="bg-base-100 border-base-200 relative aspect-square min-h-[250px] w-full max-w-sm overflow-hidden rounded-[2.5rem] border-8 shadow-2xl">
                <Image
                  src="/mascot/offline-ready-pwa-a.webp"
                  alt="PWA Experience"
                  fill
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover p-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center">
        <h2 className="mb-12 text-3xl font-bold">{t('about.title')}</h2>
        <div className="border-base-300 bg-base-200/40 relative z-10 flex flex-col items-center gap-12 rounded-[3rem] border p-8 md:flex-row md:p-16">
          <div className="flex-1 text-left text-lg leading-relaxed">
            <p>{t('about.description')}</p>
          </div>
          <div className="group relative flex-shrink-0">
            <div className="bg-primary/10 absolute inset-0 scale-110 rounded-full blur-xl transition-transform duration-700 group-hover:scale-125"></div>
            <div className="border-primary/10 relative h-48 w-48 overflow-hidden rounded-full border-2 bg-white shadow-inner">
              <Image
                src="/mascot/cross-platform-b.webp"
                alt="Pip the Mascot"
                fill
                sizes="192px"
                className="translate-y-2 scale-100 object-cover transition-transform duration-500 group-hover:scale-[1.1] group-hover:rotate-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center bg-base-300 text-base-content p-10">
        <nav className="flex flex-col gap-4 md:flex-row md:gap-8">
          <Link href="/privacy" className="link link-hover">
            {t('footer.privacy')}
          </Link>
          <Link href="/terms" className="link link-hover">
            {t('footer.terms')}
          </Link>
          <a className="link link-hover" href="mailto:davehamdan@gmail.com">
            {t('footer.contact')}
          </a>
          <a className="link link-hover" href="https://github.com/daveteply/job-tracker">
            {t('footer.github')}
          </a>
          <Link href="/beta" className="link link-hover">
            {t('footer.beta')}
          </Link>
        </nav>
        <aside>
          <p>{t('footer.copyright')}</p>
        </aside>
      </footer>
      <ScrollToTopButton />
    </div>
  );
}
