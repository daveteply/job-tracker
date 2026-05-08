'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

export function PageLoading({ entityName }: { entityName: string }) {
  const t = useTranslations('Common.Loading');
  const [randomIndex, setRandomIndex] = useState<number | null>(null);

  useEffect(() => {
    const count = parseInt(t('count'), 10);
    setRandomIndex(Math.floor(Math.random() * count));
  }, [t]);

  // Use index 0 for the initial (server) render to keep it predictable,
  // then let the useEffect randomize it on the client.
  const displayIndex = randomIndex ?? 0;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="loading loading-bars loading-lg text-primary"></span>
        <span className="text-base-content text-lg font-medium capitalize" suppressHydrationWarning>
          {t(displayIndex.toString(), { entityName })}
        </span>
      </div>
    </div>
  );
}

export default PageLoading;
