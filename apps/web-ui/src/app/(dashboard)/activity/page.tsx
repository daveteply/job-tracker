'use client';

import { EventList } from '@job-tracker/ui-components';
import { useEventsWithChildren } from '@job-tracker/hooks';
import Link from 'next/link';
import { ArchiveBoxIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function ActivityPage() {
  const { events, loading } = useEventsWithChildren();

  return (
    <>
      <div className="flex mb-3 justify-between items-center">
        <h1 className="text-xl pr-1">Activity</h1>
        {loading && (
          <span className="loading loading-spinner loading-sm opacity-20"></span>
        )}
      </div>

      {!loading && events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-base-200/30 rounded-2xl border-2 border-dashed border-base-300 min-h-[400px]">
          <ArchiveBoxIcon className="h-16 w-16 opacity-10 mb-4" />
          <h2 className="text-2xl font-bold opacity-60">No activity yet</h2>
          <p className="text-sm opacity-40 text-center mt-2 max-w-xs mb-8">
            Your activity feed is empty. Start by logging an event like an application, 
            an interview, or a networking call.
          </p>
          <Link href="/events/new" className="btn btn-primary gap-2">
            <PlusIcon className="h-5 w-5" />
            Add First Event
          </Link>
        </div>
      ) : (
        <EventList events={events} />
      )}
    </>
  );
}
