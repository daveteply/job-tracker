'use client';

import { PlusCircleIcon } from '@heroicons/react/16/solid';
// import { ReminderList, PageLoading } from '@job-tracker/ui-components';
import Link from 'next/link';

export default function ReminderListPage() {
  //const { roles, loading } = useRemindersWithCompany();

  // This is the job pipeline view.

  //if (loading) return <PageLoading entityName="roles" />;

  return (
    <>
      <div className="flex mb-3 justify-between">
        <h1 className="text-xl pr-1">Reminders</h1>
        <Link className="btn btn-sm text-primary" href="roles/new" title="Add Reminder">
          <PlusCircleIcon className="size-5" />
          Add Reminder
        </Link>
      </div>

      {/* <ReminderList roles={roles} /> */}
    </>
  );
}
