'use client';

import { use } from 'react';
import { useReminder, useReminderActions } from '@job-tracker/hooks';
import { PageLoading, ReminderForm } from '@job-tracker/ui-components';
import { ReminderInput } from '@job-tracker/validation';
import { useTranslations } from 'next-intl';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Link, useRouter } from '../../../../../../i18n/routing';

export default function ReminderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Reminders');
  const { id } = use(params);
  const { reminder, loading } = useReminder(id);
  const { upsertReminder, completeReminder } = useReminderActions();
  const router = useRouter();

  if (loading) return <PageLoading entityName={t('reminderEntityName')} />;
  if (!reminder) return <div>{t('reminderNotFound')}</div>;

  const handleComplete = async () => {
    await completeReminder(id);
    router.push('/reminders');
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl">{t('editReminder')}</h1>
        <div className="flex gap-2">
          <Link
            href={`/reminders/${id}/delete`}
            className="btn btn-ghost btn-sm text-error"
            title={t('deleteReminder')}
          >
            <TrashIcon className="size-5" />
          </Link>
        </div>
      </div>

      {!reminder.completedAt && (
        <div className="mx-auto mb-6 max-w-md px-1">
          <button
            onClick={handleComplete}
            className="btn btn-outline btn-success w-full gap-2"
          >
            <CheckCircleIcon className="size-5" />
            {t('markAsCompletedLabel')}
          </button>
        </div>
      )}

      <ReminderForm<ReminderInput>
        isEdit={true}
        initialData={{
          ...reminder,
          remindAt: reminder.remindAt.toISOString().split('T')[0] as unknown as Date,
          completedAt: (reminder.completedAt ? reminder.completedAt.toISOString().split('T')[0] : undefined) as unknown as Date,
        }}
        onSubmitAction={upsertReminder as unknown as (data: ReminderInput) => Promise<{ success: boolean; message: string }>}
        postActionRoute={`/reminders/${id}`}
      />
    </>
  );
}
