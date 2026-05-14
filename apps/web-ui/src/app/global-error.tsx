'use client';

import { useEffect } from 'react';

import { logger } from '@job-tracker/app-logic';
import { ErrorView } from '@job-tracker/ui-components';

// This component must include <html> and <body> tags
// because it replaces the entire root layout when it catches an error.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error, { tags: ['ui', 'global-error'] });
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-base-100 text-base-content min-h-screen font-sans antialiased">
        <ErrorView
          title="Well, this is awkward."
          description="Something didn't go as planned on our end. Please try again in a few seconds."
          tryAgainText="Try again"
          onReset={reset}
          error={error}
        />
      </body>
    </html>
  );
}
