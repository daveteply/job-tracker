'use client';

import { useMemo } from 'react';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { useReminderActions } from '@job-tracker/hooks';
import { ReminderForm } from '@job-tracker/ui-components';
import { ReminderInput } from '@job-tracker/validation';

export default function ReminderNewPage() {
  const t = useTranslations('Reminders');
  const { upsertReminder } = useReminderActions();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const initialData = useMemo(() => {
    return eventId ? ({ eventId } as Partial<ReminderInput>) : undefined;
  }, [eventId]);

  return (
    <>
      <div className="mb-6">
        <h1 className="px-1 text-2xl font-bold">{t('addReminder')}</h1>
      </div>

      <ReminderForm
        onSubmitAction={
          upsertReminder as unknown as (
            data: ReminderInput,
          ) => Promise<{ success: boolean; message: string }>
        }
        postActionRoute="/reminders"
        initialData={initialData}
      />
    </>
  );
}
