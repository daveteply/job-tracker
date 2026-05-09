'use client';

import { ArchiveBoxIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

import { useEventsWithChildren, useUserSettings } from '@job-tracker/hooks';
import { EmptyState, EventList, PageHeader } from '@job-tracker/ui-components';

import { Link } from '../../../../i18n/routing';

export default function ActivityPage() {
  const t = useTranslations('Activity');
  const { events, loading } = useEventsWithChildren();
  const { settings, updateSettings } = useUserSettings();

  const showFullEvents = settings?.showFullEventList ?? false;

  const handleToggleEvents = async () => {
    await updateSettings({ showFullEventList: !showFullEvents });
  };

  return (
    <>
      <PageHeader title={t('listTitle')}>
        {loading && <span className="loading loading-spinner loading-sm opacity-20"></span>}
        <Link href="/events/new" className="btn btn-sm text-primary" title={t('addFirstEvent')}>
          <PlusIcon className="size-5" />
          {t('addFirstEvent')}
        </Link>
      </PageHeader>

      {!loading && events.length === 0 ? (
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
          onToggleShowFull={handleToggleEvents}
          showExpandToggle={true}
        />
      )}
    </>
  );
}
