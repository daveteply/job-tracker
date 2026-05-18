'use client';

import React from 'react';

import { SessionProvider } from 'next-auth/react';

import { DatabaseGate, DatabaseProvider } from '@job-tracker/data-access';
import { FloatingUIProvider, ToastProvider } from '@job-tracker/ui-components';

import { LocaleGate } from './[locale]/locale-gate';
import { PostHogAuthHandler } from './analytics/posthog-auth-handler';
import { PostHogProvider } from './analytics/posthog-provider';
import { ThemeHandler } from './theme-handler';

function DatabaseLoading() {
  return (
    <div className="bg-base-100 absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="relative h-24 w-24 animate-pulse">
          <img
            src="/vireo-logo-1t.png"
            alt="Vireo Logo"
            className="h-full w-full object-contain opacity-90 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>
        <div className="flex flex-col items-center gap-6">
          <span className="loading loading-infinity loading-lg text-primary scale-150"></span>
          <div className="bg-base-300 h-1.5 w-48 overflow-hidden rounded-full">
            <div className="bg-primary h-full w-1/3 animate-[loading-progress_1.5s_infinite_linear] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <SessionProvider>
        <PostHogAuthHandler />
        <ThemeHandler />
        <ToastProvider>
          <FloatingUIProvider>{children}</FloatingUIProvider>
        </ToastProvider>
      </SessionProvider>
    </PostHogProvider>
  );
}

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <DatabaseProvider>
      <DatabaseGate fallback={<DatabaseLoading />}>
        <LocaleGate>{children}</LocaleGate>
      </DatabaseGate>
    </DatabaseProvider>
  );
}
