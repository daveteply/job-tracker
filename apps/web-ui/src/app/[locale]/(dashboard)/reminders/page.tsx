'use client';

import { useMemo } from 'react';

import { BellIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useRemindersWithChildren } from '@job-tracker/hooks';
import { EmptyState, PageHeader, PageLoading, ReminderList } from '@job-tracker/ui-components';

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
      <PageHeader title={t('listTitle')}>
        <Link
          href="/events/new"
          className="btn btn-sm text-primary"
          title={t('newEventWithReminder')}
        >
          <PlusIcon className="size-5" />
          {t('newEventWithReminder')}
        </Link>
      </PageHeader>

      {activeReminders.length === 0 ? (
        <EmptyState
          icon={<BellIcon className="h-16 w-16" />}
          title={t('noPendingReminders')}
          description={t('emptyStateDescription')}
          action={
            <Link href="/events/new" className="btn btn-primary gap-2">
              <PlusIcon className="h-5 w-5" />
              {t('newEventWithReminder')}
            </Link>
          }
        />
      ) : (
        <ReminderList reminders={activeReminders} />
      )}
    </>
  );
}
