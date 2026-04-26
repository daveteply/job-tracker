'use client';

import React from 'react';

import { SessionProvider } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { DatabaseGate,DatabaseProvider } from '@job-tracker/data-access';
import { FloatingUIProvider, PageLoading,ToastProvider } from '@job-tracker/ui-components';

import { PostHogAuthHandler } from './analytics/posthog-auth-handler';
import { PostHogProvider } from './analytics/posthog-provider';

function DatabaseLoading() {
  const t = useTranslations('Common');
  return <PageLoading entityName={t('database')} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <SessionProvider>
        <PostHogAuthHandler />
        <DatabaseProvider>
          <DatabaseGate fallback={<DatabaseLoading />}>
            <ToastProvider>
              <FloatingUIProvider>{children}</FloatingUIProvider>
            </ToastProvider>
          </DatabaseGate>
        </DatabaseProvider>
      </SessionProvider>
    </PostHogProvider>
  );
}
