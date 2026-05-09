'use client';

import { useTranslations } from 'next-intl';

import { ErrorView } from '@job-tracker/ui-components';

import { useRouter } from '../../i18n/routing';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('Error');
  const router = useRouter();

  return (
    <ErrorView
      title={t('title')}
      description={t('description')}
      tryAgainText={t('tryAgain')}
      backHomeText={t('backHome')}
      onReset={reset}
      onBackHome={() => router.push('/')}
      error={error}
    />
  );
}
