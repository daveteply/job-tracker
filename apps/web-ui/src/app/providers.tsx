'use client';

import React from 'react';
import { DatabaseProvider } from '@job-tracker/data-access';
import { FloatingUIProvider, ToastProvider } from '@job-tracker/ui-components';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DatabaseProvider>
        <ToastProvider>
          <FloatingUIProvider>{children}</FloatingUIProvider>
        </ToastProvider>
      </DatabaseProvider>
    </SessionProvider>
  );
}
