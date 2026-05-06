'use client';

import { useMemo } from 'react';

import { PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import {
  useEventsWithChildren,
  useGroupedRoles,
  useRemindersWithChildren,
  useRolesWithEvents,
  useUserSettings,
} from '@job-tracker/hooks';
import { EventList, ReminderList, RoleList } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const tNav = useTranslations('Navigation');
  const { reminders, loading: loadingReminders } = useRemindersWithChildren();
  const { events, loading: loadingEvents } = useEventsWithChildren();
  const { roles, loading: loadingRoles } = useRolesWithEvents();
  const { settings, updateSettings } = useUserSettings();
  const { pipeline: activeRoles } = useGroupedRoles(roles);

  const showFullEvents = settings?.showFullEventList ?? false;

  const handleToggleEvents = async () => {
    await updateSettings({ showFullEventList: !showFullEvents });
  };

  const activeReminders = useMemo(() => {
    return reminders
      .filter((r) => !r.completedAt)
      .sort((a, b) => a.remindAt.getTime() - b.remindAt.getTime());
  }, [reminders]);

  const recentEvents = useMemo(() => {
    return [...events].sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime()).slice(0, 5);
  }, [events]);

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
      <h1 className="px-1 text-2xl font-bold">{tNav('home')}</h1>

      <section>
        <h2 className="mb-4 px-1 text-xl font-bold">{t('reminders')}</h2>
        {loadingReminders ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <ReminderList reminders={activeReminders} />
        )}
      </section>

      <section>
        <h2 className="mb-4 px-1 text-xl font-bold">{t('recentActivity')}</h2>
        {loadingEvents ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <EventList
            events={recentEvents}
            showControls={true}
            showFull={showFullEvents}
            onToggleShowFull={handleToggleEvents}
            showExpandToggle={true}
          />
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between px-1">
          <h2 className="text-xl font-bold">{t('activeRoles')}</h2>
          <Link href="/roles" className="btn btn-ghost btn-sm text-primary gap-1 px-2">
            {t('seeAllRoles')}
          </Link>
        </div>
        {loadingRoles ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <RoleList
            activeRoles={activeRoles}
            showFull={false}
            noRolesMessage={t('noActiveRoles')}
          />
        )}
      </section>
    </div>
  );
}
