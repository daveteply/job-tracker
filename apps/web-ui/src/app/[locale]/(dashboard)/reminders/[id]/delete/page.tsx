'use client';

import { use } from 'react';

import { useTranslations } from 'next-intl';

import { useReminder, useReminderActions } from '@job-tracker/hooks';
import { EntityDelete, PageLoading } from '@job-tracker/ui-components';

export default function ReminderDeletePage({ params }: { params: Promise<{ id: string }> }) {
  const t = useTranslations('Reminders');
  const tCommon = useTranslations('Common');
  const { id } = use(params);
  const { reminder, loading } = useReminder(id);
  const { removeReminder } = useReminderActions();

  if (loading) return <PageLoading entityName={t('reminderEntityName')} />;
  if (!reminder) return <div>{t('reminderNotFound')}</div>;

  return (
    <>
      <div className="mb-3">
        <h1 className="text-xl">{t('deleteReminder')}</h1>
      </div>

      <EntityDelete
        id={id}
        onDeleteAction={removeReminder}
        entityName={t('reminderEntityName')}
        postActionRoute="/reminders"
        translations={{
          reminder: tCommon('deleteReminder'),
          confirm: tCommon('deleteAction', { name: t('reminderEntityName') }),
          cancel: tCommon('cancel'),
          success: tCommon('deleteSuccess', { name: t('reminderEntityName') }),
          error: tCommon('deleteError', { name: t('reminderEntityName') }),
        }}
      />
    </>
  );
}
