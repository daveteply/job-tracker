'use client';

import React from 'react';
import { DatabaseProvider, DatabaseGate } from '@job-tracker/data-access';
import { FloatingUIProvider, ToastProvider, PageLoading } from '@job-tracker/ui-components';
import { SessionProvider } from 'next-auth/react';
import { useTranslations } from 'next-intl';

function DatabaseLoading() {
  const t = useTranslations('Common');
  return <PageLoading entityName={t('database')} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DatabaseProvider>
        <DatabaseGate fallback={<DatabaseLoading />}>
          <ToastProvider>
            <FloatingUIProvider>{children}</FloatingUIProvider>
          </ToastProvider>
        </DatabaseGate>
      </DatabaseProvider>
    </SessionProvider>
  );
}
