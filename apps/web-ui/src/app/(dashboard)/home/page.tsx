'use client';

import {
  useEventsWithChildren,
  useRemindersWithChildren,
  useReminderActions,
  useRolesWithCompany,
} from '@job-tracker/hooks';
import {
  ReminderList,
  EventInfoCard,
  RoleInfoCard,
} from '@job-tracker/ui-components';
import { RoleStatus } from '@job-tracker/domain';
import { useMemo } from 'react';

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
    return [...events]
      .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
      .slice(0, 5);
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

  return (
    <div className="space-y-8 pb-8">
      <section>
        <h2 className="text-xl font-bold mb-4 px-1">Reminders</h2>
        {loadingReminders ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <ReminderList
            reminders={activeReminders}
            onComplete={completeReminder}
          />
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 px-1">Recent Activity</h2>
        {loadingEvents ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : recentEvents.length > 0 ? (
          <div className="space-y-1">
            {recentEvents.map((event) => (
              <EventInfoCard key={event.id} event={event} showControls={false} />
            ))}
          </div>
        ) : (
          <p className="text-sm opacity-50 italic px-1">No recent activity</p>
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
