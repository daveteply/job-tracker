'use client';

import { useMemo } from 'react';

import { BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useRemindersWithChildren } from '@job-tracker/hooks';
import { PageLoading, ReminderList } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function ReminderListPage() {
  const t = useTranslations('Reminders');
  const { reminders, loading } = useRemindersWithChildren();

  const activeReminders = useMemo(() => {
    return reminders
      .filter((r) => !r.completedAt)
      .sort((a, b) => a.remindAt.getTime() - b.remindAt.getTime());
  }, [reminders]);

  if (loading) return <PageLoading entityName={t('listTitle')} />;

  return (
    <>
      <div className="mb-3 flex justify-between">
        <h1 className="pr-1 text-xl">{t('listTitle')}</h1>
      </div>

      {activeReminders.length === 0 ? (
        <div className="bg-base-200/30 border-base-300 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12">
          <BellIcon className="mb-4 h-16 w-16 opacity-10" />
          <h2 className="text-2xl font-bold opacity-60">{t('noPendingReminders')}</h2>
          <p className="mt-2 mb-8 max-w-xs text-center text-sm opacity-40">
            {t('emptyStateDescription')}
          </p>
          <Link href="/events/new" className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            {t('newEventWithReminder')}
          </Link>
        </div>
      ) : (
        <ReminderList reminders={activeReminders} />
      )}
    </>
  );
}
