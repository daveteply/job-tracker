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
import { Link } from '../../../../i18n/routing';
import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');
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
      <div className="bg-base-200/30 border-base-300 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12">
        <div className="relative mb-6 h-20 w-20 opacity-20 grayscale">
          <Image
            src="/android-chrome-192x192.png"
            alt="Job Tracker Logo"
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        <h2 className="text-center text-2xl font-bold opacity-60">{t('welcome')}</h2>
        <p className="mt-2 mb-8 max-w-xs text-center text-sm opacity-40">
          {t('emptyStateDescription')}
        </p>
        <Link href="/events/new" className="btn btn-primary gap-2">
          <PlusIcon className="h-5 w-5" />
          {t('addFirstEvent')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <section>
        <h2 className="mb-4 px-1 text-xl font-bold">{t('reminders')}</h2>
        {loadingReminders ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <ReminderList reminders={activeReminders} onComplete={completeReminder} />
        )}
      </section>

      <section>
        <h2 className="mb-4 px-1 text-xl font-bold">{t('recentActivity')}</h2>
        {loadingEvents ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <EventList events={recentEvents} showControls={false} />
        )}
      </section>

      <section>
        <h2 className="mb-4 px-1 text-xl font-bold">{t('activeRoles')}</h2>
        {loadingRoles ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : activeRoles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeRoles.map((role) => (
              <RoleInfoCard key={role.id} role={role} renderFull={false} />
            ))}
          </div>
        ) : (
          <p className="px-1 text-sm italic opacity-50">{t('noActiveRoles')}</p>
        )}
      </section>
    </div>
  );
}
