'use client';

import { useReminderActions } from '@job-tracker/hooks';
import { ReminderForm } from '@job-tracker/ui-components';
import { ReminderInput } from '@job-tracker/validation';
import { useTranslations } from 'next-intl';

export default function ReminderNewPage() {
  const t = useTranslations('Reminders');
  const { upsertReminder } = useReminderActions();

  return (
    <>
      <div className="mb-3">
        <h1 className="text-xl">{t('addReminder')}</h1>
      </div>

      <ReminderForm<ReminderInput>
        onSubmitAction={upsertReminder as unknown as (data: ReminderInput) => Promise<{ success: boolean; message: string }>}
        postActionRoute="/reminders"
      />
    </>
  );
}
