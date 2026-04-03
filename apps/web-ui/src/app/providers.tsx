'use client';

import React from 'react';
import { DatabaseProvider } from '@job-tracker/data-access';
import { ToastProvider } from '@job-tracker/ui-components';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DatabaseProvider>
      <ToastProvider>{children}</ToastProvider>
    </DatabaseProvider>
  );
}
