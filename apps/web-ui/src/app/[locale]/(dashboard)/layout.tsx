import { getTranslations, setRequestLocale } from 'next-intl/server';

import { BottomNav, Breadcrumbs, FloatingActionButton, Header } from '@job-tracker/ui-components';

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
    <div className="flex min-h-screen flex-col pb-14">
      <Header title={t('title')} iconSrc="/favicon-32x32.png" />
      <nav className="bg-accent-content px-4">
        <div className="mx-auto max-w-screen-xl">
          <Breadcrumbs />
        </div>
      </nav>
      <main className="mx-auto w-full max-w-screen-xl grow p-4">{children}</main>
      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}
