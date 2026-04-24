'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function PageLoading({ entityName }: { entityName: string }) {
  const t = useTranslations('Common.Loading');
  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    const count = parseInt(t('count'), 10);
    setRandomIndex(Math.floor(Math.random() * count));
  }, [t]);

  return (
    <div className="bg-base-100/50 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-none">
      <div>
        <span className="mr-2 capitalize">{t(randomIndex.toString(), { entityName })}</span>
        <span className="loading loading-bars loading-xs text-primary"></span>
      </div>
    </div>
  );
}

export default PageLoading;
