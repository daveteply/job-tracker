'use client';

import { use } from 'react';
import { useReminder, useReminderActions } from '@job-tracker/hooks';
import { PageLoading, ReminderForm } from '@job-tracker/ui-components';
import { useTranslations } from 'next-intl';

export default function ReminderEditPage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Reminders');
  const { id } = use(params);
  const { reminder, loading } = useReminder(id);
  const { upsertReminder } = useReminderActions();

  if (loading) return <PageLoading entityName={t('reminderEntityName')} />;
  if (!reminder) return <div>{t('reminderNotFound')}</div>;

  return (
    <>
      <div className="mb-3">
        <h1 className="text-xl">{t('editReminder')}</h1>
      </div>

      <ReminderForm
        isEdit={true}
        initialData={{
          ...reminder,
          remindAt: reminder.remindAt.toISOString().split('T')[0],
          completedAt: reminder.completedAt ? reminder.completedAt.toISOString().split('T')[0] : undefined,
        } as any}
        onSubmitAction={upsertReminder as any}
        postActionRoute={`/reminders/${id}`}
      />
    </>
  );
}
