'use client';

import {
  useEventsWithChildren,
  useRemindersWithChildren,
  useReminderActions,
  useRolesWithCompany,
} from '@job-tracker/hooks';
import { ReminderList, EventList, RoleInfoCard } from '@job-tracker/ui-components';
import { RoleStatus } from '@job-tracker/domain';
import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';

// Purpose: Daily command center
// "What do I need to do today?"

export default function HomePage() {
  const { reminders, loading: loadingReminders } = useRemindersWithChildren();
  const { events, loading: loadingEvents } = useEventsWithChildren();
  const { roles, loading: loadingRoles } = useRolesWithCompany();
  const { completeReminder } = useReminderActions();

  const activeReminders = useMemo(() => {
    return reminders
      .filter((r) => !r.completedAt)
      .sort((a, b) => a.remindAt.getTime() - b.remindAt.getTime());
  }, [reminders]);

  const recentEvents = useMemo(() => {
    return [...events].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()).slice(0, 5);
  }, [events]);

  const activeRoles = useMemo(() => {
    const activeStatuses = [
      RoleStatus.Lead,
      RoleStatus.Applied,
      RoleStatus.Interviewing,
      RoleStatus.Offer,
    ];
    return roles.filter((r) => activeStatuses.includes(r.status));
  }, [roles]);

  const isEmpty = useMemo(() => {
    return (
      !loadingReminders &&
      !loadingEvents &&
      !loadingRoles &&
      reminders.length === 0 &&
      events.length === 0 &&
      roles.length === 0
    );
  }, [
    loadingReminders,
    loadingEvents,
    loadingRoles,
    reminders.length,
    events.length,
    roles.length,
  ]);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-base-200/30 rounded-2xl border-2 border-dashed border-base-300 min-h-[400px]">
        <div className="relative w-20 h-20 mb-6 grayscale opacity-20">
          <Image
            src="/android-chrome-192x192.png"
            alt="Job Tracker Logo"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-2xl font-bold opacity-60 text-center">Welcome to Job Tracker!</h2>
        <p className="text-sm opacity-40 text-center mt-2 max-w-xs mb-8">
          Your command center is currently empty. Add your first event to start tracking your job
          search journey.
        </p>
        <Link href="/events/new" className="btn btn-primary gap-2">
          <PlusIcon className="h-5 w-5" />
          Add First Event
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <section>
        <h2 className="text-xl font-bold mb-4 px-1">Reminders</h2>
        {loadingReminders ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <ReminderList reminders={activeReminders} onComplete={completeReminder} />
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 px-1">Recent Activity</h2>
        {loadingEvents ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <EventList events={recentEvents} showControls={false} />
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 px-1">Active Roles</h2>
        {loadingRoles ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : activeRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRoles.map((role) => (
              <RoleInfoCard key={role.id} role={role} renderFull={false} />
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-50 italic px-1">No active roles</p>
        )}
      </section>
    </div>
  );
}
