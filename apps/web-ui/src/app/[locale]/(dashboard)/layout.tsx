import { ViewTransition } from 'react';

import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BottomNav, Breadcrumbs, FloatingActionButton, Header } from '@job-tracker/ui-components';

import { DashboardProviders } from '../../providers';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('DashboardLayout');

  return (
    <DashboardProviders>
      <div className="flex min-h-screen flex-col pb-14">
        <Header title={t('title')} iconSrc="/favicon-32x32.png" />
        <nav className="breadcrumbs-nav bg-base-200 text-base-content/70 px-4">
          <div className="mx-auto max-w-screen-xl">
            <Breadcrumbs />
          </div>
        </nav>
        <main className="mx-auto w-full max-w-screen-xl grow p-4">
          <ViewTransition
            enter={{
              'nav-forward': 'slide-in-right',
              'nav-back': 'slide-in-left',
              default: 'auto',
            }}
            exit={{
              'nav-forward': 'slide-out-left',
              'nav-back': 'slide-out-right',
              default: 'auto',
            }}
          >
            {children}
          </ViewTransition>
        </main>
        <BottomNav />
        <FloatingActionButton />
      </div>
    </DashboardProviders>
  );
}
