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
                className="object-contain blur-[0.1px] drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
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
            <p className="mt-4 text-sm font-medium opacity-70">{t('microBenefit')}</p>
            <a
              href="#meet-pip"
              className="text-primary/70 hover:text-primary mt-6 text-sm font-semibold transition-colors hover:underline"
            >
              {t('meetPip')}
            </a>
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
                {(key === 'offlineReady' || key === 'localFirst') && (
                  <div className="card-actions mt-4 justify-end">
                    <a
                      href={key === 'offlineReady' ? '#pwa-install' : '#local-first-matters'}
                      className="btn btn-link btn-xs text-primary p-0 font-semibold no-underline hover:underline"
                    >
                      {t(`features.${key}.learnMore`)} →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Pip Section */}
      <section id="meet-pip" className="bg-base-200/50 scroll-mt-20 overflow-hidden px-4 py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 text-center lg:flex-row lg:text-left">
          <div className="order-2 flex-1 lg:order-1">
            <div className="bg-primary/10 text-primary mb-6 inline-block rounded-full px-4 py-1 text-sm font-bold tracking-wider uppercase">
              {t('pip.tagline')}
            </div>
            <h2 className="mb-8 text-4xl font-bold md:text-5xl">{t('pip.title')}</h2>
            <p className="text-base-content/80 text-xl leading-relaxed">{t('pip.description')}</p>
          </div>
          <div className="order-1 flex flex-1 justify-center lg:order-2">
            <div className="group relative">
              <div className="bg-primary/10 absolute inset-0 scale-110 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
              <div className="border-base-100 relative h-64 w-64 overflow-hidden rounded-full border-4 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2 md:h-80 md:w-80">
                <Image
                  src="/mascot/Pip512.png"
                  alt="Pip the Mascot"
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Why Local-First Section */}{' '}
      <section id="local-first-matters" className="bg-base-100 scroll-mt-20 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">{t('localFirstDetail.title')}</h2>
            <p className="mx-auto max-w-3xl text-xl opacity-80">
              {t('localFirstDetail.description')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-base-200 rounded-3xl p-8 transition-transform hover:-translate-y-1">
              <div className="bg-primary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl">
                <svg
                  className="text-primary h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-bold">{t('localFirstDetail.privacy.title')}</h3>
              <p className="opacity-70">{t('localFirstDetail.privacy.description')}</p>
            </div>

            <div className="bg-base-200 rounded-3xl p-8 transition-transform hover:-translate-y-1">
              <div className="bg-secondary/10 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl">
                <svg
                  className="text-secondary h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-bold">{t('localFirstDetail.speed.title')}</h3>
              <p className="opacity-70">{t('localFirstDetail.speed.description')}</p>
            </div>

            <div className="bg-base-200 rounded-3xl p-8 transition-transform hover:-translate-y-1">
              <div className="bg-accent/10 mb-6 flex h-12 w-12 items-center justify-center rounded-2xl">
                <svg
                  className="text-accent h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-bold">{t('localFirstDetail.offline.title')}</h3>
              <p className="opacity-70">{t('localFirstDetail.offline.description')}</p>
            </div>
          </div>
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
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <PwaInstallButton />
              <p className="text-xs font-medium opacity-60">{t('pwa.platforms')}</p>
            </div>
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
      {/* Final CTA Section */}
      <section className="bg-base-100 px-4 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">{t('finalCta.title')}</h2>
          <Link
            className="btn btn-primary btn-lg px-12 shadow-xl transition-transform hover:scale-105"
            href="/home"
          >
            {t('finalCta.button')}
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer footer-center bg-base-300 text-base-content p-10">
        <aside className="flex flex-col items-center md:flex-row md:gap-4">
          <Image
            src="/favicon-32x32.png"
            alt={`${BRANDING.name} Icon`}
            width={32}
            height={32}
            className="mb-2 opacity-80 md:mb-0"
          />
          <div className="flex flex-col items-center md:flex-row md:gap-2">
            <p className="font-bold">{BRANDING.name}</p>
            <p className="hidden opacity-20 md:block">|</p>
            <p className="text-sm opacity-60">{t('footer.copyright')}</p>
          </div>
        </aside>
        <nav className="flex flex-wrap justify-center gap-2 md:gap-8">
          <Link
            href="/privacy"
            className="bg-base-100/40 hover:bg-base-100/60 md:link md:link-hover rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 md:bg-transparent md:p-0 md:text-base md:font-normal md:hover:bg-transparent md:active:scale-100"
          >
            {t('footer.privacy')}
          </Link>
          <Link
            href="/terms"
            className="bg-base-100/40 hover:bg-base-100/60 md:link md:link-hover rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 md:bg-transparent md:p-0 md:text-base md:font-normal md:hover:bg-transparent md:active:scale-100"
          >
            {t('footer.terms')}
          </Link>
          <a
            href="mailto:davehamdan@gmail.com"
            className="bg-base-100/40 hover:bg-base-100/60 md:link md:link-hover rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 md:bg-transparent md:p-0 md:text-base md:font-normal md:hover:bg-transparent md:active:scale-100"
          >
            {t('footer.contact')}
          </a>
          <a
            href="https://github.com/daveteply/job-tracker"
            className="bg-base-100/40 hover:bg-base-100/60 md:link md:link-hover rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 md:bg-transparent md:p-0 md:text-base md:font-normal md:hover:bg-transparent md:active:scale-100"
          >
            {t('footer.github')}
          </a>
          <Link
            href="/beta"
            className="bg-base-100/40 hover:bg-base-100/60 md:link md:link-hover rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95 md:bg-transparent md:p-0 md:text-base md:font-normal md:hover:bg-transparent md:active:scale-100"
          >
            {t('footer.beta')}
          </Link>
        </nav>
      </footer>
      <ScrollToTopButton />
    </div>
  );
}
