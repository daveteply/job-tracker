'use client';

import { useReminderActions } from '@job-tracker/hooks';
import { ReminderForm } from '@job-tracker/ui-components';
import { useTranslations } from 'next-intl';

export default function ReminderNewPage() {
  const t = useTranslations('Reminders');
  const { upsertReminder } = useReminderActions();

  return (
    <>
      <div className="mb-3">
        <h1 className="text-xl">{t('addReminder')}</h1>
      </div>

      <ReminderForm
        onSubmitAction={upsertReminder as any}
        postActionRoute="/reminders"
      />
    </>
  );
}
