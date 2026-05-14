'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function BackButton() {
  const router = useRouter();
  const t = useTranslations('Common');

  return (
    <button
      onClick={() => router.back()}
      className="text-primary mb-4 flex items-center gap-2 text-sm hover:underline"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      {t('back')}
    </button>
  );
}

export default BackButton;
