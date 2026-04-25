'use client';

import { use } from 'react';
import { useReminder } from '@job-tracker/hooks';
import { ReminderInfoCard, PageLoading } from '@job-tracker/ui-components';
import { Link } from '../../../../../i18n/routing';
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useTranslations } from 'next-intl';

export default function ReminderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Reminders');
  const { id } = use(params);
  const { reminder, loading } = useReminder(id);

  if (loading) return <PageLoading entityName={t('reminderEntityName')} />;
  if (!reminder) return <div>{t('reminderNotFound')}</div>;

  return (
    <>
      <div className="mb-3 flex">
        <h1 className="pr-2 text-xl">{t('reminderDetails')}</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${id}/edit`}
          title={t('editReminder')}
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${id}/delete`}
          title={t('deleteReminder')}
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      <ReminderInfoCard reminder={reminder} showControls={false} showChevron={false} />

      <div className="mt-5">
        <Link className="btn mr-3" href="/reminders">
          {t('backToReminders')}
        </Link>
      </div>
    </>
  );
}
