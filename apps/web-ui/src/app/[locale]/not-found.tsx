'use client';

import { useTranslations } from 'next-intl';

import { ErrorView } from '@job-tracker/ui-components';

import { useRouter } from '../../i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');
  const router = useRouter();

  return (
    <ErrorView
      title={t('title')}
      description={t('description')}
      backHomeText={t('backHome')}
      onBackHome={() => router.push('/')}
    />
  );
}
