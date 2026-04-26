'use client';

import { ArchiveBoxIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useEventsWithChildren } from '@job-tracker/hooks';
import { EventList } from '@job-tracker/ui-components';

export default function ActivityPage() {
  const t = useTranslations('Activity');
  const { events, loading } = useEventsWithChildren();

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="pr-1 text-xl">{t('listTitle')}</h1>
        {loading && <span className="loading loading-spinner loading-sm opacity-20"></span>}
      </div>

      {!loading && events.length === 0 ? (
        <div className="bg-base-200/30 border-base-300 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12">
          <ArchiveBoxIcon className="mb-4 h-16 w-16 opacity-10" />
          <h2 className="text-2xl font-bold opacity-60">{t('noActivityYet')}</h2>
          <p className="mt-2 mb-8 max-w-xs text-center text-sm opacity-40">
            {t('emptyStateDescription')}
          </p>
          <Link href="/events/new" className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            {t('addFirstEvent')}
          </Link>
        </div>
      ) : (
        <EventList events={events} />
      )}
    </>
  );
}
