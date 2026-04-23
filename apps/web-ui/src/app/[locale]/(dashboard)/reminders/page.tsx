'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
import { useReminderActions, useRemindersWithChildren } from '@job-tracker/hooks';
import { PageLoading, ReminderList } from '@job-tracker/ui-components';
import Link from 'next/link';
import { useMemo } from 'react';
import { BellIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ReminderListPage() {
  const { reminders, loading } = useRemindersWithChildren();
  const { completeReminder } = useReminderActions();

  const activeReminders = useMemo(() => {
    return reminders
      .filter((r) => !r.completedAt)
      .sort((a, b) => a.remindAt.getTime() - b.remindAt.getTime());
  }, [reminders]);

  if (loading) return <PageLoading entityName="reminders" />;

  return (
    <>
      <div className="mb-3 flex justify-between">
        <h1 className="pr-1 text-xl">Reminders</h1>
        <Link className="btn btn-sm text-primary" href="/events/new" title="Add Reminder">
          <PlusCircleIcon className="size-5" />
          Add Reminder
        </Link>
      </div>

      {activeReminders.length === 0 ? (
        <div className="bg-base-200/30 border-base-300 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12">
          <BellIcon className="mb-4 h-16 w-16 opacity-10" />
          <h2 className="text-2xl font-bold opacity-60">No pending reminders</h2>
          <p className="mt-2 mb-8 max-w-xs text-center text-sm opacity-40">
            You're all caught up! When you log events, you can set reminders to follow up or perform
            next steps.
          </p>
          <Link href="/events/new" className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            New Event with Reminder
          </Link>
        </div>
      ) : (
        <ReminderList reminders={activeReminders} onComplete={completeReminder} />
      )}
    </>
  );
}
