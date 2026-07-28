'use client';

import ArchiveBoxIcon from '@heroicons/react/24/outline/ArchiveBoxIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useTranslations } from 'next-intl';

import { useEventsWithChildren, useUserSettings } from '@job-tracker/hooks';
import {
  EmptyState,
  EventList,
  EventListExpandToggle,
  ListSkeleton,
  PageHeader,
} from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function ActivityPage() {
  const t = useTranslations('Activity');
  const { events, loading } = useEventsWithChildren();
  const { settings, updateSettings } = useUserSettings();

  if (loading) return <ListSkeleton />;

  const showFullEvents = settings?.showFullEventList ?? false;
  const eventExpandedStates = settings?.eventExpandedStates ?? {};

  const handleToggleEvents = async () => {
    await updateSettings({
      showFullEventList: !showFullEvents,
      eventExpandedStates: {},
    });
  };

  const handleToggleEventExpand = async (eventId: string) => {
    const current = eventExpandedStates[eventId] ?? showFullEvents;
    await updateSettings({
      eventExpandedStates: {
        ...eventExpandedStates,
        [eventId]: !current,
      },
    });
  };

  return (
    <>
      <PageHeader title={t('listTitle')}>
        <EventListExpandToggle showFull={showFullEvents} onToggleShowFull={handleToggleEvents} />
        {events.length === 0 && (
          <Link href="/events/new" className="btn btn-sm text-primary" title={t('addFirstEvent')}>
            <PlusIcon className="size-5" />
            {t('addFirstEvent')}
          </Link>
        )}
      </PageHeader>

      {events.length === 0 ? (
        <EmptyState
          icon={<ArchiveBoxIcon className="h-16 w-16" />}
          title={t('noActivityYet')}
          description={t('emptyStateDescription')}
          action={
            <Link href="/events/new" className="btn btn-primary gap-2">
              <PlusIcon className="h-5 w-5" />
              {t('addFirstEvent')}
            </Link>
          }
        />
      ) : (
        <EventList
          events={events}
          showFull={showFullEvents}
          eventExpandedStates={eventExpandedStates}
          onToggleShowFull={handleToggleEvents}
          onToggleEventExpand={handleToggleEventExpand}
        />
      )}
    </>
  );
}
